const request = require('request');
const node_helper = require("node_helper");

module.exports = node_helper.create({
	socketNotificationReceived: function(notification, payload)
	{
		const self = this;

		if(notification === "GET_SEL_DATA")
		{
			let returnData = {};
			let yesterday = (function(d){ d.setDate(d.getDate()-1); return d})(new Date);
			const yesterday_date = yesterday.toISOString().substring(0, 10);

			const solarEdgeOverviewUrl = payload.config.url + payload.config.siteId + "/overview?api_key=" + payload.config.apiKey;
			const solarEdgeYesterdayUrl = payload.config.url + payload.config.siteId + "/energy?timeUnit=DAY&endDate=" + yesterday_date + "&startDate=" + yesterday_date + "&api_key=" + payload.config.apiKey;

			request(solarEdgeOverviewUrl, function (error, response, body)
			{
				if (!error && response.statusCode == 200)
				{
					returnData = JSON.parse(body);
				}

				request(solarEdgeYesterdayUrl, function (error, response, body)
				{
					if (!error && response.statusCode == 200)
					{
						let yesterData = JSON.parse(body);
						returnData.yesterday = yesterData.energy.values[0].value;
					}

					self.sendSocketNotification("SEL_DATA", returnData);
				});
			});
		}
	},
});
