const NodeHelper = require("node_helper");
const axios = require('axios');
const currentPriceCoindesk = async () => {
  const response = await axios.get( "https://api.coindesk.com/v1/bpi/currentprice.json");

  const formatedResponse =  response.data;
  const time = formatedResponse.time;
  const chartName = formatedResponse.chartName;
  const btcEUR = formatedResponse.bpi.EUR;
  const btcUSD = formatedResponse.bpi.USD;
  return { time, chartName, btcEUR, btcUSD };
};

const evolPriceCoindesk = async () => {
  const response = await axios.get( "https://api.coindesk.com/v1/bpi/historical/close.json");
  const formatedResponse =  response.data;
  const time = formatedResponse.time;
  const pricesDates = formatedResponse.bpi;
  return { time, pricesDates };
};

module.exports = NodeHelper.create({
  start: () => {console.log('start COJNS')},
  socketNotificationReceived: async function (
    notification,
    payload
  ) {
    switch (notification) {
      case "GET_COINS":
        const helper = this;

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
        helper.sendSocketNotification("COINS", {
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
