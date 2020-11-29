/* Magic Mirror
 * Node Helper: next-train-transilien
 *
 * By
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const fs = require("fs");
const cheerio = require("cheerio");
const got = require("got");

module.exports = NodeHelper.create({
  // Override socketNotificationReceived method.

  /* socketNotificationReceived(notification, payload)
   * This method is called when a socket notification arrives.
   *
   * argument notification string - The identifier of the noitication.
   * argument payload mixed - The payload of the notification.
   */

  // Test another function

  parseDom: function (dom) {
    const $ = cheerio.load(dom);
    const nbResult =
      $(".class_trajet").length > 8 ? 8 : $(".class_trajet").length;
    const response = [];
    for (let i = 0; i < nbResult; i += 2) {
      const heure = $(".class_trajet .panel-heading .col-xs-1")[i].children[1]
        .children[0].data;

      const mission = $(".class_trajet .panel-heading .code_train")[i / 2]
        .children[1].children[0].data;
      const icon =
        "https://www.horaires-de-trains.fr/" +
        $(".class_trajet .panel-heading .cod")[i / 2].attribs.src;
      response.push({ heure, mission, icon });
    }

    return response;
  },
  anotherFunction: async function (payload) {
    const response = await got(payload.defaultURL);
    return this.parseDom(response.body);
  },

  socketNotificationReceived: async function (notification, payload) {
    if (notification === "next-train-transilien-NOTIFICATION_TEST") {
      console.log("payload: ", payload);
      // Send notification
      const result = await this.anotherFunction(payload);
      this.sendNotificationTest(result); //Is possible send objects :)
    }
  },

  // Example function send notification test
  sendNotificationTest: async function (payload) {
    this.sendSocketNotification(
      "next-train-transilien-NOTIFICATION_TEST",
      payload
    );
  }
});
