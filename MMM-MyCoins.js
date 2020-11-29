Module.register("MMM-Coinbase", {
  defaults: {
    BTCAccount: 0.06555257,
    totalInvestissement: 800,
    // updateInterval: 1
  },

  getStyles: function () {
    return [this.file("css/styles.css")];
  },

  start: function () {
    //Flag for check if module is loaded
    this.BTCEUR = 0;
    this.BTCUSD = 0;
    this.BTCAccountPrice = 0;
    this.balance = 0;
  },

  getHeader: function () {
    return (
      this.data.header +
      "<span class='right'>" +
      this.balance +
      " " +
      this.currency +
      "</span>"
    );
  },

  getDom: function () {
    const list = document.createElement("div");
    list.id = document.createElement("div");
    const sign = balance >= 0 ? "+" : "-";
    const colorGain = this.balance >= 0 ? "good" : "bad";

    const DomObj = [
      {
        title: "BTC : ",
        id: "BTCamount",
        value: this.BTCEUR + " € / " + this.BTCUSD + " $",
      },
      {
        title: "Total de BTC : ",
        id: "BTCAccount",
        value: this.config.BTCAccount + " BTC",
      },
      {
        title: "Montant investit : ",
        id: "totalInvestissement",
        value: this.config.totalInvestissement + " €",
      },
      {
        title: "Valeur actuelle : ",
        id: "BTCAccountPrice",
        value: Math.round(this.BTCAccountPrice) + " €",
        class: colorGain,
      },
      {
        title: "Gains : ",
        id: "balance",
        value: sign + Math.round(this.balance) + " €",
        class: colorGain,
      },
    ];

    DomObj.forEach((div) => {
      const div = document.createElement("div");
      const spanTitle = document.createElement("span");
      spanTitle.innerText = div.title;
      const spanValue = document.createElement("span");
      spanValue.id = div.id;
      if (div.class) spanValue.classList.add(div.class);
      spanValue.innerText = BTCEUR + " € / " + BTCUSD + " $";
      div.appendChild(spanTitle);
      div.appendChild(spanValue);
      list.appendChild(div);
    });

    document.getElementById("BTCAccountPrice").classList.add(colorGain);
    document.getElementById("balance").innerHTML =
      sign + Math.round(balance) + " €";
    document.getElementById("balance").classList.add(colorGain);

    const can = document.createElement("canvas");
    can.id = "myChart";
    can.width = "350";
    can.height = "180";
    list.appendChild(can);

    return list;
  },

  notificationReceived: function (notification) {
    switch (notification) {
      case "DOM_OBJECTS_CREATED":
        setInterval(() => {
          this.sendSocketNotification("GET_ACCOUNTS", {
            BTCAccount: this.config.BTCAccount,
            totalInvestissement: this.config.totalInvestissement,
          });
        }, 5000);

        break;
    }
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "ACCOUNTS":
        this.BTCEUR = payload.BTCEUR;
        this.BTCUSD = payload.BTCUSD;
        this.BTCAccountPrice = payload.BTCAccountPrice;
        this.balance = payload.balance;
        this.labels = payload.labels;
        this.data = payload.data;
        this.updateDom();

        break;
    }
  },
});
