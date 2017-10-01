"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var nav_service_1 = require('./../../services/nav.service');
var angular2_color_picker_1 = require('angular2-color-picker');
var http_1 = require('@angular/http');
var auth_service_1 = require('./../../services/auth.service');
var config_service_1 = require('./../../services/config.service');
var router_1 = require('@angular/router');
var LightComponent = (function () {
    function LightComponent(nav, cpService, _http, auth, router, route, configUrl) {
        this.cpService = cpService;
        this._http = _http;
        this.auth = auth;
        this.router = router;
        this.route = route;
        this.configUrl = configUrl;
        this.widgets = [];
        this.allWidgets = [];
        this.noLights = false;
        this.newWidgetState = [];
        this.color = "#127bdc";
        this.isLoading = false;
        this.forLoading = false;
        this.showProfile = false;
    }
    LightComponent.prototype.ngOnInit = function () {
        sessionStorage.setItem("stateData", "");
        this.showData();
        if (this.configUrl.autoRefresh == true) {
            var self_1 = this;
            this._setIntervalHandler = setInterval(function () {
                if (sessionStorage.getItem("stateData") == undefined) {
                    clearInterval(self_1._setIntervalHandler);
                }
                else {
                    self_1.showData();
                }
            }, 10000);
        }
    };
    LightComponent.prototype.ngOnDestroy = function () {
        clearInterval(this._setIntervalHandler);
    };
    LightComponent.prototype.hidePopup = function (e) {
        $(e.target).parent().find(".color-picker").toggle();
    };
    LightComponent.prototype.roundUpBrightness = function (bright) {
        return Math.round((bright / 254) * 100);
    };
    LightComponent.prototype.roundUpSaturation = function (saturation) {
        return Math.round((saturation / 254) * 100);
    };
    LightComponent.prototype.deviceIcon = function (devicetype, thisDeviceType) {
        return devicetype == thisDeviceType;
    };
    LightComponent.prototype.checkCapable = function (capablelist, capable) {
        var capablelistItems = [];
        for (var i = 0; i < capablelist.length; i++) {
            capablelistItems.push(capablelist[i].capabilityName);
        }
        if (capablelistItems.indexOf(capable) > -1) {
            return true;
        }
    };
    LightComponent.prototype.showProfilePopup = function (widget) {
        widget.showProfile = true;
    };
    LightComponent.prototype.backToControls = function (widget) {
        widget.showProfile = false;
    };
    LightComponent.prototype.showPublicProfile = function (type) {
        return type == "PUBLIC";
    };
    LightComponent.prototype.deviceName = function (name) {
        var name = name.substring(0, 14);
        return name;
    };
    LightComponent.prototype.getData = function () {
        var headers = new http_1.Headers();
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "includeState=true&includeCapability=true";
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        if (this.forLoading == false) {
            this.isLoading = true;
        }
        return this._http.get(this.configUrl.apiPath + '/cpi/devices/profiles', options)
            .map(function (response) { return response.json(); });
    };
    LightComponent.prototype.templateData = function (res) {
        var arr = [];
        var lwidget = {};
        this.widgets = res;
        if (this.widgets.length == 0) {
            this.noLights = true;
        }
        else {
            this.noLights = false;
        }
        for (var i = 0; i < this.widgets.length; i++) {
            if (this.widgets[i].state != "No State In CPI ") {
                this.widgets[i].state = JSON.parse(this.widgets[i].state);
                this.widgets[i].state.bri = this.widgets[i].state.bri == null ? 0 : this.widgets[i].state.bri;
                this.widgets[i].state.sat = this.widgets[i].state.sat == null ? 0 : this.widgets[i].state.sat;
                this.widgets[i].showProfile = false;
            }
            else {
                this.widgets[i].state = {};
                this.widgets[i].state.on = true;
                this.widgets[i].state.bri = 0;
                this.widgets[i].state.sat = 0;
                this.widgets[i].state.hue = 1000;
                this.widgets[i].state.reachable = true;
            }
            arr.push(this.widgets[i].state);
        }
        var totalArray = "";
        for (var k = 0; k < arr.length; k++) {
            var j = JSON.stringify(arr[k]);
            totalArray = totalArray.concat(j);
        }
        var totalNewState = sessionStorage.getItem("stateData");
        if (totalNewState != "") {
            totalNewState = JSON.parse(totalNewState);
        }
        var totalNewState1 = "";
        if (totalNewState != undefined) {
            for (var z = 0; z < totalNewState.length; z++) {
                var m = JSON.stringify(totalNewState[z]);
                totalNewState1 = totalNewState1.concat(m);
            }
        }
        if (totalArray != totalNewState1) {
            this.allWidgets = this.widgets;
            sessionStorage.setItem("stateData", JSON.stringify(arr));
        }
        else {
            console.log("equal");
        }
    };
    LightComponent.prototype.showData = function () {
        var _this = this;
        this.getData().subscribe(function (res) {
            _this.forLoading = true;
            _this.isLoading = false;
            _this.templateData(res);
        }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.getData().subscribe(function (data) {
                        self.forLoading = true;
                        self.isLoading = false;
                        self.templateData(data);
                    });
                });
            }
        });
    };
    LightComponent.prototype.putOnorOff = function (onof, deviceId) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "userName=" + localStorage.getItem("uname");
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var on = onof == true ? "switch" : "switch";
        var switchon = onof == true ? "ON" : "OFF";
        var data = {
            "deviceId": deviceId,
            "actionType": on,
            "command": switchon
        };
        var url2 = this.configUrl.apiPath + '/cpi/commands';
        return this._http
            .post(url2, data, options)
            .map(function (res) { return res.json(); });
    };
    LightComponent.prototype.showOnorOff = function (onof, deviceId) {
        var _this = this;
        this.putOnorOff(onof, deviceId).subscribe(function (data) {
            console.log(data);
        }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putOnorOff(onof, deviceId).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    LightComponent.prototype.putChangeColor = function (color, deviceId) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "userName=" + localStorage.getItem("uname");
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var data = {
            "deviceId": deviceId,
            "actionType": "hue",
            "command": color.toString()
        };
        var url = this.configUrl.apiPath + '/cpi/commands';
        return this._http
            .post(url, data, options)
            .map(function (res) { return res.json(); });
    };
    LightComponent.prototype.showChangeColor = function (color, deviceId) {
        var _this = this;
        this.putChangeColor(color, deviceId).subscribe(function (data) { return _this.data = data; }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putChangeColor(color, deviceId).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    LightComponent.prototype.putChangeBrightness = function (bright, deviceId) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "userName=" + localStorage.getItem("uname");
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var data = {
            "deviceId": deviceId,
            "actionType": "bri",
            "command": bright.toString()
        };
        var url = this.configUrl.apiPath + '/cpi/commands';
        //let url1 = 'http://jsonplaceholder.typicode.com/posts/1';
        return this._http
            .post(url, data, options)
            .map(function (res) { return res.json(); });
    };
    LightComponent.prototype.showChangeBrightness = function (bright, deviceId) {
        var _this = this;
        this.putChangeBrightness(bright, deviceId).subscribe(function (data) { return _this.data = data; }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putChangeBrightness(bright, deviceId).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    LightComponent.prototype.putChangeSaturation = function (saturation, deviceId) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "userName=" + localStorage.getItem("uname");
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var data = {
            "deviceId": deviceId,
            "actionType": "sat",
            "command": saturation.toString()
        };
        var url = this.configUrl.apiPath + '/cpi/commands';
        //let url1 = 'http://jsonplaceholder.typicode.com/posts/1';
        return this._http
            .post(url, data, options)
            .map(function (res) { return res.json(); });
    };
    LightComponent.prototype.showChangeSaturation = function (saturation, deviceId) {
        var _this = this;
        this.putChangeSaturation(saturation, deviceId).subscribe(function (data) { return _this.data = data; }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putChangeSaturation(saturation, deviceId).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    LightComponent = __decorate([
        core_1.Component({
            selector: 'light-cmp',
            moduleId: module.id,
            templateUrl: 'lights.component.html'
        }), 
        __metadata('design:paramtypes', [nav_service_1.NavService, angular2_color_picker_1.ColorPickerService, http_1.Http, auth_service_1.AuthService, router_1.Router, router_1.ActivatedRoute, config_service_1.ConfigService])
    ], LightComponent);
    return LightComponent;
}());
exports.LightComponent = LightComponent;
//# sourceMappingURL=lights.component.js.map