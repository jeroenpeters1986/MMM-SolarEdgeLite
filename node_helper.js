var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	socketNotificationReceived: function(notification, payload)
	{
		const self = this;

		if(notification === "GET_SOLAR")
		{
			let returnData = {};
			let yesterday = new Date();
			const yesterday_date = yesterday.setDate(yesterday.getDate() - 1).toISOString().substring(0, 10);

			const solarEdgeOverviewUrl = payload.config.url + payload.config.siteId + "/overview?api_key=" + payload.config.apiKey;
			const solarEdgeYesterdayUrl = payload.config.url + payload.config.siteId + "/energy?timeUnit=DAY&endDate=" + yesterday_date + "&startDate=" + yesterday_date + "&api_key=" + payload.config.apiKey;

			request(solarEdgeOverviewUrl, function (error, response, body)
			{
				if (!error && response.statusCode == 200)
				{
					Object.assign(returnData, JSON.parse(body));
				}
			});

			request(solarEdgeYesterdayUrl, function (error, response, body)
			{
				if (!error && response.statusCode == 200)
				{
					Object.assign(returnData, JSON.parse(body));
				}
			});

			console.log(returnData);

			self.sendSocketNotification("SOLAR_DATA", JSON.parse(returnData));
		}
	},
});
