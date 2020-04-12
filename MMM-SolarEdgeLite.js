/*
 * Magic Mirror module for displaying minimal SolarEdge data
 * Today, yesterday, this month, smaller font
 * By Jeroen Peters (jeroenpeters1986), forked from bertieuk https://github.com/bertieuk/MMM-Solar
 * MIT Licensed
 */

Module.register("MMM-SolarEdgeLite",{
    defaults: {
        url: "https://monitoringapi.solaredge.com/site/",
        apiKey: "",
        siteId: "12345",
        refInterval: 1000 * 60 * 5,
        basicHeader: false,
        language: 'en'
    },

    /* This one is not very solid, we'll see if we can improve it when the module increases popularity */
    // Get the modules text-strings based on user preferred languages
    getLangStrings: function(lang, string_title)
    {
        let strings = [];
        if( lang === 'nl' ) {
            strings["title"] = "Zonnepanelen";
            strings["loading"] = "Bezig met laden...";
            strings["titles"] = ["Huidig vermogen:", "Vandaag:", "Gisteren:", "Deze maand:"];
            strings["suffixes"] = ["Watt", "kWh", "kWh", "kWh"];
            strings["results"] = ["Laden...", "Laden...", "Laden...", "Laden..."];
        } else {
            strings["title"] = "SolarEdge PV";
            strings["loading"] = "Loading...";
            strings["titles"] = ["Current power:", "Today:", "Yesterday:", "This month:"];
            strings["suffixes"] = ["Watt", "kWh", "kWh", "kWh"];
            strings["results"] = ["Loading...", "Loading...", "Loading...", "Loading...",];
        }
        return strings[string_title];
    },

    // Start the module
    start: function() {
        this.titles = this.getLangStrings(this.config.language, 'titles');
        this.suffixes = this.getLangStrings(this.config.language, 'suffixes');
        this.results = this.getLangStrings(this.config.language, 'results');
        this.loaded = false;
        this.getSolarData();

        if (this.config.basicHeader) {
            this.data.header = this.getLangStrings(this.config.language, 'title');
        }

        const self = this;

        //Schedule updates
        setInterval(function() {
            self.getSolarData();
            self.updateDom();
        }, this.config.refInterval);
    },

    // Import additional CSS Styles
    getStyles: function() {
        return ['solar.css']
    },

    // Contact node helper for solar data
    getSolarData: function() {
        this.sendSocketNotification("GET_SEL_DATA", {
            config: this.config
        });
    },

    // Handle node helper response
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SEL_DATA") {
	        let currentPower = payload.overview.currentPower.power;
	        if (currentPower > 1000) {
               this.results[0] = (currentPower / 1000).toFixed(2) + " kW";
            } else {
               this.results[0] = currentPower + " Watt";
            }
            this.results[1] = (payload.overview.lastDayData.energy / 1000).toFixed(2) + " kWh";
            this.results[2] = (payload.yesterday / 1000).toFixed(2) + " kWh";
            this.results[3] = (payload.overview.lastMonthData.energy / 1000).toFixed(2) + " kWh";
            this.loaded = true;
            this.updateDom(1000);
        }
    },

    // Override dom generator.
    getDom: function() {
        let wrapper = document.createElement("div");

        if (this.config.apiKey === "" || this.config.siteId === "") {
            wrapper.innerHTML = "No configuration!";
            return wrapper;
        }

        //Display loading while waiting for API response
        if (!this.loaded) {
      	    wrapper.innerHTML = this.getLangStrings(this.config.language, 'loading');
            return wrapper;
      	}

        let tb = document.createElement("table");

        if (!this.config.basicHeader) {
            let imgDiv = document.createElement("div");
            let img = document.createElement("img");
            img.align = "absmiddle";
            img.src = "/modules/MMM-SolarEdgeLite/solar_white.png";

            let sTitle = document.createElement("p");
            sTitle.innerHTML = this.getLangStrings(this.config.language, 'title');
            sTitle.className += " thin normal";
            imgDiv.appendChild(img);
            imgDiv.appendChild(sTitle);

            let divider = document.createElement("hr");
            divider.className += " dimmed";
            wrapper.appendChild(imgDiv);
            wrapper.appendChild(divider);
        }

      	for (let i = 0; i < this.results.length; i++) {
        		let row = document.createElement("tr");
        		let titleTr = document.createElement("td");
        		let dataTr = document.createElement("td");

        		titleTr.innerHTML = this.titles[i];
        		dataTr.innerHTML = this.results[i] + " " + this.suffixes[i];
                dataTr.innerHTML = this.results[i];
        		titleTr.className += " small regular bright";
        		dataTr.className += " small light normal";

        		row.appendChild(titleTr);
        		row.appendChild(dataTr);

        		tb.appendChild(row);
      	}

        wrapper.appendChild(tb);
        return wrapper;
    }
});
