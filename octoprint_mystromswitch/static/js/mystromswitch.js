$(function() {
    function mystromswitchViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];
        self.printer = parameters[2];

        self.onOffButtonEnabled = ko.observable();
        self.mystromswitchPowerValue = document.getElementById("mystromswitchPowerValue")

        self.onToggleRelayEvent = function(){
            $.ajax({
                url: API_BASEURL + "plugin/mystromswitch",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: "toggleRelais",
                }),
                contentType: "application/json; charset=UTF-8"
            })
        }

        self.onmystromswitchEvent = function() {
            if (self.onOffButtonEnabled()) {
                $.ajax({
                    url: API_BASEURL + "plugin/mystromswitch",
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify({
                        command: "enableRelais",
                    }),
                    contentType: "application/json; charset=UTF-8"
                })
            } else {
                $.ajax({
                    url: API_BASEURL + "plugin/mystromswitch",
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify({
                        command: "disableRelais",
                    }),
                    contentType: "application/json; charset=UTF-8"
                })
            }
        }

        self.onOffButtonEnabled.subscribe(self.onmystromswitchEvent, self);

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "mystromswitch" && plugin != "octoprint_mystromswitch") {
                return;
            }
			self.onOffButtonEnabled(data.onOffButtonEnabled);
			if(data.relay == false){
			    self.mystromswitchPowerValue.innerHTML = "Relay is off";
			} else if (data.power != null) {
                self.mystromswitchPowerValue.innerHTML = "Power Consumption "+data.power.toFixed(1)+"W";
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push([
        mystromswitchViewModel,
        ["loginStateViewModel", "settingsViewModel", "printerStateViewModel"],
		$(".sidebar_plugin_mystromswitch").get(0)
    ]);
});
