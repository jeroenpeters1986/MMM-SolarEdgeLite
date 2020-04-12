/*
* Magic Mirror module for displaying minimal SolarEdge data
* Today, yesterday, this month
* By Jeroen Peters (jeroenpeters1986), forked from BertieUK https://github.com/bertieuk/MMM-Solar
* MIT Licensed
*/

Module.register("MMM-SolarEdge",{
    defaults: {
        url: "https://monitoringapi.solaredge.com/site/",
        apiKey: "",
        siteId: "12345",
        refInterval: 1000 * 60 * 5,
        basicHeader: false,
        language: 'en'
    },
    /* This one is not very solid, we'll see if we can improve it when the module increases popularity */
    getLangStrings: function(lang, string_title)
    {
        let strings = [];
        if( lang == 'nl' ) {
            strings["title"] = "Zonnepanelen";
            strings["titles"] = ["Huidig vermogen:", "Vandaag gegenereerd:", "Deze maand:", "Afgelopen jaar:", "Totale looptijd:"];
            strings["suffixes"] = ["Watt", "kWh", "kWh", "kWh", "MWh"];
            strings["results"] = ["Laden...", "Laden...", "Laden...", "Laden...", "Laden..."];
        } else {
            strings["title"] = "SolarEdge PV";
            strings["titles"] = ["Current power:", "Generated today:", "This month:", "Last Year:", "Lifetime Energy:"];
            strings["suffixes"] = ["Watt", "kWh", "kWh", "kWh", "MWh"];
            strings["results"] = ["Laden...", "Laden...", "Laden...", "Laden...", "Laden..."];
        }
        return strings[string_title];
    },
    start: function() {
        this.titles = this.getLangStrings(this.config.language, 'titles');
        this.suffixes = this.getLangStrings(this.config.language, 'suffixes');
        this.results = this.getLangStrings(this.config.language, 'results');
        this.loaded = false;
        this.getSolarData();

        if (this.config.basicHeader) {
            this.data.header = this.getLangStrings(this.config.language, 'title');
        }

        var self = this;

        //Schedule updates
        setInterval(function() {
            self.getSolarData();
            self.updateDom();
        }, this.config.refInterval);
    },



    //Import additional CSS Styles
    getStyles: function() {
        return ['solar.css']
    },

    //Contact node helper for solar data
    getSolarData: function() {
        this.sendSocketNotification("GET_SOLAR", {
            config: this.config
          });
    },

    //Handle node helper response
    socketNotificationReceived: function(notification, payload) {
    if (notification === "SOLAR_DATA") {
	    var currentPower = payload.overview.currentPower.power;
	    if (currentPower > 1000) {
               this.results[0] = (currentPower / 1000).toFixed(2) + " kW";
            } else {
               this.results[0] = currentPower + " Watt";
            }
            this.results[1] = (payload.overview.lastDayData.energy / 1000).toFixed(2) + " kWh";
            this.results[2] = (payload.overview.lastMonthData.energy / 1000).toFixed(2) + " kWh";
            this.results[3] = (payload.overview.lastYearData.energy / 1000).toFixed(2) + " kWh";
            this.results[4] = (payload.overview.lifeTimeData.energy / 1000000).toFixed(2) + " MWh";
            this.loaded = true;
            this.updateDom(1000);
        }
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
	if (this.config.apiKey === "" || this.config.siteId === "") {
	    wrapper.innerHTML = "No configuration!";
	    return wrapper;
	}

        //Display loading while waiting for API response
        if (!this.loaded) {
      	    wrapper.innerHTML = "Loading...";
            return wrapper;
      	}

        var tb = document.createElement("table");

        if (!this.config.basicHeader) {
            var imgDiv = document.createElement("div");
            var img = document.createElement("img");
            img.src = "/modules/MMM-SolarEdge/solar_white.png";

            var sTitle = document.createElement("p");
            sTitle.innerHTML = this.getLangStrings(this.config.language, 'title');
            sTitle.className += " thin normal";
            imgDiv.appendChild(img);
    	      imgDiv.appendChild(sTitle);

            var divider = document.createElement("hr");
            divider.className += " dimmed";
            wrapper.appendChild(imgDiv);
            wrapper.appendChild(divider);
        }

      	for (var i = 0; i < this.results.length; i++) {
        		var row = document.createElement("tr");

        		var titleTr = document.createElement("td");
        		var dataTr = document.createElement("td");

        		titleTr.innerHTML = this.titles[i];
        		dataTr.innerHTML = this.results[i] + " " + this.suffixes[i];
                dataTr.innerHTML = this.results[i];
        		titleTr.className += " medium regular bright";
        		dataTr.classname += " medium light normal";

        		row.appendChild(titleTr);
        		row.appendChild(dataTr);

        		tb.appendChild(row);
      	}
        wrapper.appendChild(tb);
        return wrapper;
    }
});
