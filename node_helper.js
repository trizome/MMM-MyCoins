const NodeHelper = require("node_helper");

const currentPriceCoindesk = async () => {
  const response = await fetch(
    "https://api.coindesk.com/v1/bpi/currentprice.json"
  );
  const formatedResponse = await response.json();
  const time = formatedResponse.time;
  const chartName = formatedResponse.chartName;
  const btcEUR = formatedResponse.bpi.EUR;
  const btcUSD = formatedResponse.bpi.USD;
  return { time, chartName, btcEUR, btcUSD };
};

const evolPriceCoindesk = async () => {
  const response = await fetch(
    "https://api.coindesk.com/v1/bpi/historical/close.json"
  );
  const formatedResponse = await response.json();
  const time = formatedResponse.time;
  const pricesDates = formatedResponse.bpi;
  return { time, pricesDates };
};

module.exports = NodeHelper.create({
  start: () => {},
  socketNotificationReceived: async function (
    notification,
    payload = { BTCAccount: 0.06555257, totalInvestissement: 800 }
  ) {
    switch (notification) {
      case "GET_ACCOUNTS":
        const { BTCAccount, totalInvestissement } = payload;
        const currentPrice = await currentPriceCoindesk();
        const evolPrices = await evolPriceCoindesk();
        const BTCEUR = Math.round(currentPrice.btcEUR.rate_float);
        const BTCUSD = Math.round(currentPrice.btcUSD.rate_float);
        const BTCAccountPrice = BTCAccount * currentPrice.btcEUR.rate_float;
        const balance = BTCAccountPrice - totalInvestissement;

        const labels = Object.keys(evolPrices.pricesDates).map((key) => key);
        const data = Object.keys(evolPrices.pricesDates).map(
          (key) => evolPrices.pricesDates[key]
        );

        helper.sendSocketNotification("ACCOUNTS", {
          BTCEUR,
          BTCUSD,
          BTCAccountPrice,
          balance,
          labels,
          data,
        });

        break;
    }
  },
});
