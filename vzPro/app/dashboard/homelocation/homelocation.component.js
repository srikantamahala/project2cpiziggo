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
var nav_service_1 = require('../../services/nav.service');
var http_1 = require('@angular/http');
var config_service_1 = require('./../../services/config.service');
var auth_service_1 = require('./../../services/auth.service');
var router_1 = require('@angular/router');
var HomelocationComponent = (function () {
    function HomelocationComponent(nav, _http, configUrl, auth, _router) {
        this.nav = nav;
        this._http = _http;
        this.configUrl = configUrl;
        this.auth = auth;
        this._router = _router;
        this.isLoading = false;
        this.hideAll = false;
    }
    HomelocationComponent.prototype.ngOnInit = function () {
        this.auth.isShowDemo = true;
        this.showData();
    };
    HomelocationComponent.prototype.goPreviousView = function () {
        this.auth.isShowDemo = false;
        this._router.navigate(['dashboard']);
        //window.history.back();
    };
    HomelocationComponent.prototype.deviceIcon = function (devicetype, thisDeviceType) {
        return devicetype == thisDeviceType;
    };
    HomelocationComponent.prototype.checkCapable = function (capablelist, capable) {
        var capablelistItems = [];
        for (var i = 0; i < capablelist.length; i++) {
            capablelistItems.push(capablelist[i].capabilityName);
        }
        if (capablelistItems.indexOf(capable) > -1) {
            return true;
        }
    };
    HomelocationComponent.prototype.setTypeWidget = function (widget) {
        this.showIndex = "";
        this.hideAll = true;
        this.typeWidget = widget;
    };
    HomelocationComponent.prototype.getTypeWidget = function (widget) {
        return this.typeWidget == widget;
    };
    HomelocationComponent.prototype.showControl = function (i) {
        return i == this.showIndex;
    };
    HomelocationComponent.prototype.showWidget = function (i) {
        this.showIndex = (this.showIndex == i) ? "" : i;
    };
    HomelocationComponent.prototype.deviceName = function (name) {
        var name = name.substring(0, 14);
        return name;
    };
    HomelocationComponent.prototype.bulbstyle = function (index) {
        if (index == 0) {
            return { "margin-left": "50%", "margin-top": "250px", "cursor": "pointer", "position": "absolute" };
        }
        if (index == 1) {
            return { "margin-left": "15%", "margin-top": "220px", "cursor": "pointer", "position": "absolute" };
        }
        if (index == 2) {
            return { "margin-left": "70%", "margin-top": "150px", "cursor": "pointer", "position": "absolute" };
        }
    };
    HomelocationComponent.prototype.popupstyle = function (index) {
        if (index == 0) {
            return { "margin-left": "55%", "margin-top": "190px", "cursor": "pointer", "position": "absolute" };
        }
        if (index == 1) {
            return { "margin-left": "20%", "margin-top": "140px", "cursor": "pointer", "position": "absolute" };
        }
        if (index == 2) {
            return { "margin-left": "75%", "margin-top": "70px", "cursor": "pointer", "position": "absolute" };
        }
    };
    HomelocationComponent.prototype.getData = function () {
        var headers = new http_1.Headers();
        headers.append('Authorization', "bearer " + this.auth.getToken());
        var params = "includeState=true&includeCapability=true";
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        this.isLoading = true;
        return this._http.get(this.configUrl.apiPath + '/cpi/devices/profiles', options)
            .map(function (response) { return response.json(); });
    };
    HomelocationComponent.prototype.showData = function () {
        var _this = this;
        this.getData().subscribe(function (res) {
            _this.isLoading = false;
            _this.widgets = res;
            for (var i = 0; i < _this.widgets.length; i++) {
                if (_this.widgets[i].state != "No State In CPI ") {
                    _this.widgets[i].state = JSON.parse(_this.widgets[i].state);
                    _this.widgets[i].state.bri = _this.widgets[i].state.bri == null ? 0 : _this.widgets[i].state.bri;
                    _this.widgets[i].state.sat = _this.widgets[i].state.sat == null ? 0 : _this.widgets[i].state.sat;
                    _this.widgets[i].showProfile = false;
                }
                else {
                    _this.widgets[i].state = {};
                    _this.widgets[i].state.on = true;
                    _this.widgets[i].state.bri = 0;
                    _this.widgets[i].state.sat = 0;
                    _this.widgets[i].state.hue = 1000;
                    _this.widgets[i].state.reachable = true;
                }
            }
        }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.getData().subscribe(function (data) {
                        self.isLoading = false;
                        self.widgets = data;
                        for (var i = 0; i < self.widgets.length; i++) {
                            if (self.widgets[i].state != "No State In CPI ") {
                                self.widgets[i].state = JSON.parse(self.widgets[i].state);
                                self.widgets[i].state.bri = self.widgets[i].state.bri == null ? 0 : self.widgets[i].state.bri;
                                self.widgets[i].state.sat = self.widgets[i].state.sat == null ? 0 : self.widgets[i].state.sat;
                                self.widgets[i].showProfile = false;
                            }
                            else {
                                self.widgets[i].state = {};
                                self.widgets[i].state.on = true;
                                self.widgets[i].state.bri = 0;
                                self.widgets[i].state.sat = 0;
                                self.widgets[i].state.hue = 1000;
                                self.widgets[i].state.reachable = true;
                            }
                        }
                    });
                });
            }
        });
    };
    HomelocationComponent.prototype.putOnorOff = function (onof, deviceId) {
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
    HomelocationComponent.prototype.showOnorOff = function (onof, deviceId) {
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
    HomelocationComponent.prototype.putChangeColor = function (color, deviceId) {
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
    HomelocationComponent.prototype.showChangeColor = function (color, deviceId) {
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
    HomelocationComponent = __decorate([
        core_1.Component({
            selector: 'homelocation-cmp',
            moduleId: module.id,
            templateUrl: 'homelocation.component.html',
            animations: [
                core_1.trigger('deviceAnimation', [
                    core_1.transition(':enter', [
                        core_1.style({ transform: 'translateY(100%)', opacity: 0 }),
                        core_1.animate('800ms', core_1.style({ transform: 'translateX(0)', 'opacity': 1 }))
                    ])])
            ],
        }), 
        __metadata('design:paramtypes', [nav_service_1.NavService, http_1.Http, config_service_1.ConfigService, auth_service_1.AuthService, router_1.Router])
    ], HomelocationComponent);
    return HomelocationComponent;
}());
exports.HomelocationComponent = HomelocationComponent;
//# sourceMappingURL=homelocation.component.js.map