Module.register("MMM-MyCoins", {
  defaults: {
    BTCAccount: 0.06555257,
    totalInvestissement: 800,
    // updateInterval: 1
  },

 /* getStyles: function () {
    return [this.file("css/styles.css")];
  },*/

  start: function () {
    this.BTCEUR = 0;
    this.BTCUSD = 0;
    this.BTCAccountPrice = 0;
    this.balance = 0;
  },

  getStyles: function () {
		return [
			"MMM-MyCoins.css",
		];
	},

  getDom: function () {
    const list = document.createElement("div");
 if (!this.balance) return list;
    list.id = 'list';
   
    const sign = this.balance >= 0 ? "+" : "-";
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
        classe: colorGain,
      },
      {
        title: "Gains : ",
        id: "balance",
        value: sign + Math.round(this.balance) + " €",
        classe: colorGain,
      },
    ];
   
    DomObj.forEach((line) => {
      const div = document.createElement("div");
      const spanTitle = document.createElement("span");
      spanTitle.innerText = line.title;
      const spanValue = document.createElement("span");
      spanValue.id = line.id;
      if (line.classe) spanValue.classList.add('balance', line.classe);
      spanValue.innerText = line.value;
      div.appendChild(spanTitle);
      div.appendChild(spanValue);
      list.appendChild(div);
    });

 
/*
   const can = document.createElement("canvas");
    can.id = "myChart";
    can.width = "350";
    can.height = "180";
    list.appendChild(can);
*/    
    return list;
  },

  notificationReceived: function (notification) {
    switch (notification) {
      case "DOM_OBJECTS_CREATED":
        this.sendSocketNotification("GET_COINS", {
            BTCAccount: this.config.BTCAccount,
            totalInvestissement: this.config.totalInvestissement,
          });
        setInterval(() => {
          this.sendSocketNotification("GET_COINS", {
            BTCAccount: this.config.BTCAccount,
            totalInvestissement: this.config.totalInvestissement,
          });
        }, 15000);

        break;
    }
  },

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "COINS":
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
