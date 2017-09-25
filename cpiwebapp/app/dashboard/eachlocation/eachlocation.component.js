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
var EachLocationComponent = (function () {
    function EachLocationComponent(nav, cpService, _http, auth, router, route, configUrl) {
        this.cpService = cpService;
        this._http = _http;
        this.auth = auth;
        this.router = router;
        this.route = route;
        this.configUrl = configUrl;
        this.widgets = [];
        this.newWidgetState = [];
        this.devices = [];
        this.alldevices = [];
        this.serverError = false;
        this.isLoading = false;
        this.forLoading = false;
        this.color = "#127bdc";
    }
    EachLocationComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.showData()
        this.route
            .queryParams
            .subscribe(function (params) {
            _this.locationId = params['location'];
            _this.locationName = params['locationName'];
            _this.showLocationDevices(_this.locationId);
        });
        sessionStorage.setItem("locstateData", "");
        if (this.configUrl.autoRefresh == true) {
            var self_1 = this;
            this._setIntervalHandler = setInterval(function () {
                if (sessionStorage.getItem("locstateData") == undefined) {
                    clearInterval(self_1._setIntervalHandler);
                }
                else {
                    self_1.showLocationDevices(self_1.locationId);
                }
            }, 10000);
        }
    };
    EachLocationComponent.prototype.ngOnDestroy = function () {
        clearInterval(this._setIntervalHandler);
    };
    EachLocationComponent.prototype.hidePopup = function (e) {
        $(e.target).parent().find(".color-picker").toggle();
    };
    EachLocationComponent.prototype.roundUpBrightness = function (bright) {
        return Math.round((bright / 254) * 100);
    };
    EachLocationComponent.prototype.roundUpSaturation = function (saturation) {
        return Math.round((saturation / 254) * 100);
    };
    EachLocationComponent.prototype.deviceIcon = function (devicetype, thisDeviceType) {
        return devicetype == thisDeviceType;
    };
    EachLocationComponent.prototype.checkCapable = function (capablelist, capable) {
        var capablelistItems = [];
        for (var i = 0; i < capablelist.length; i++) {
            capablelistItems.push(capablelist[i].capabilityName);
        }
        if (capablelistItems.indexOf(capable) > -1) {
            return true;
        }
    };
    EachLocationComponent.prototype.deviceName = function (name) {
        var name = name.substring(0, 14);
        return name;
    };
    EachLocationComponent.prototype.showProfilePopup = function (widget) {
        widget.showProfile = true;
    };
    EachLocationComponent.prototype.backToControls = function (widget) {
        widget.showProfile = false;
    };
    EachLocationComponent.prototype.showPublicProfile = function (type) {
        return type == "PUBLIC";
    };
    EachLocationComponent.prototype.getLocationDevices = function (locationid) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "includeState=true&includeCapability=true";
        //let url = this.configUrl.apiPath+'/cpi/locations/'+locationid;
        var url = this.configUrl.apiPath + "/cpi/locations/" + locationid + "/profiles";
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        if (this.forLoading == false) {
            this.isLoading = true;
        }
        return this._http.get(url, options)
            .map(function (response) { return response.json(); });
    };
    EachLocationComponent.prototype.showLocationData = function (data) {
        var arr = [];
        this.devices = data;
        for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].state != "No State In CPI ") {
                this.devices[i].state = JSON.parse(this.devices[i].state);
                this.devices[i].state.bri = this.devices[i].state.bri == null ? 0 : this.devices[i].state.bri;
                this.devices[i].state.sat = this.devices[i].state.sat == null ? 0 : this.devices[i].state.sat;
                this.devices[i].showProfile = false;
            }
            else {
                this.devices[i].state = {};
                this.devices[i].state.on = true;
                this.devices[i].state.bri = 0;
                this.devices[i].state.sat = 0;
                this.devices[i].state.hue = 1000;
                this.devices[i].state.reachable = true;
            }
            arr.push(this.devices[i].state);
        }
        var totalArray = "";
        for (var k = 0; k < arr.length; k++) {
            var j = JSON.stringify(arr[k]);
            totalArray = totalArray.concat(j);
        }
        var totalNewState = sessionStorage.getItem("locstateData");
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
            sessionStorage.setItem("locstateData", JSON.stringify(arr));
            this.alldevices = this.devices;
        }
        else {
            console.log("equal");
        }
    };
    EachLocationComponent.prototype.handleErrorCode = function (error) {
        if (error.json().errorCode != undefined) {
            this.errorDescription = this.error.json().errorList[0];
            this.isLoading = false;
            this.forLoading = true;
            this.serverError = true;
        }
    };
    EachLocationComponent.prototype.showLocationDevices = function (locationid) {
        var _this = this;
        this.getLocationDevices(locationid).subscribe(function (data) {
            _this.forLoading = true;
            _this.isLoading = false;
            _this.showLocationData(data);
        }, function (err) {
            var self = _this;
            _this.error = err;
            _this.handleErrorCode(_this.error);
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.getLocationDevices(locationid).subscribe(function (data) {
                        self.isLoading = false;
                        self.forLoading = true;
                        self.showLocationData(data);
                    });
                });
            }
        });
    };
    EachLocationComponent.prototype.putOnorOff = function (onof, deviceid) {
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
            "deviceId": deviceid,
            "actionType": on,
            "command": switchon
        };
        var url2 = this.configUrl.apiPath + '/cpi/commands';
        return this._http
            .post(url2, data, options)
            .map(function (res) { return res.json(); });
    };
    EachLocationComponent.prototype.showOnorOff = function (onof, deviceid) {
        var _this = this;
        this.putOnorOff(onof, deviceid).subscribe(function (data) {
            console.log(data);
        }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putOnorOff(onof, deviceid).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    EachLocationComponent.prototype.putChangeColor = function (color, deviceid) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "userName=" + localStorage.getItem("uname");
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var data = {
            "deviceId": deviceid,
            "actionType": "hue",
            "command": color.toString()
        };
        var url = this.configUrl.apiPath + '/cpi/commands';
        return this._http
            .post(url, data, options)
            .map(function (res) { return res.json(); });
    };
    EachLocationComponent.prototype.showChangeColor = function (color, deviceid) {
        var _this = this;
        this.putChangeColor(color, deviceid).subscribe(function (data) { return _this.data = data; }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putChangeColor(color, deviceid).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    EachLocationComponent.prototype.putChangeBrightness = function (bright, deviceid) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "userName=" + localStorage.getItem("uname");
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var data = {
            "deviceId": deviceid,
            "actionType": "bri",
            "command": bright.toString()
        };
        var url = this.configUrl.apiPath + '/cpi/commands';
        //let url1 = 'http://jsonplaceholder.typicode.com/posts/1';
        return this._http
            .post(url, data, options)
            .map(function (res) { return res.json(); });
    };
    EachLocationComponent.prototype.showChangeBrightness = function (bright, deviceid) {
        var _this = this;
        this.putChangeBrightness(bright, deviceid).subscribe(function (data) { return _this.data = data; }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putChangeBrightness(bright, deviceid).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    EachLocationComponent.prototype.putChangeSaturation = function (saturation, deviceid) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "userName=" + localStorage.getItem("uname");
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var data = {
            "deviceId": deviceid,
            "actionType": "sat",
            "command": saturation.toString()
        };
        var url = this.configUrl.apiPath + '/cpi/commands';
        return this._http
            .post(url, data, options)
            .map(function (res) { return res.json(); });
    };
    EachLocationComponent.prototype.showChangeSaturation = function (saturation, deviceid) {
        var _this = this;
        this.putChangeSaturation(saturation, deviceid).subscribe(function (data) { return _this.data = data; }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.putChangeSaturation(saturation, deviceid).subscribe(function (data) {
                        console.log(data);
                    });
                });
            }
        });
    };
    EachLocationComponent = __decorate([
        core_1.Component({
            selector: 'eachlocation-cmp',
            moduleId: module.id,
            templateUrl: 'eachlocation.component.html'
        }), 
        __metadata('design:paramtypes', [nav_service_1.NavService, angular2_color_picker_1.ColorPickerService, http_1.Http, auth_service_1.AuthService, router_1.Router, router_1.ActivatedRoute, config_service_1.ConfigService])
    ], EachLocationComponent);
    return EachLocationComponent;
}());
exports.EachLocationComponent = EachLocationComponent;
//# sourceMappingURL=eachlocation.component.js.map