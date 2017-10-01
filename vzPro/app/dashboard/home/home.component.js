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
var HomeComponent = (function () {
    function HomeComponent(nav, _http, configUrl, auth) {
        this.nav = nav;
        this._http = _http;
        this.configUrl = configUrl;
        this.auth = auth;
        this.allWidgets = [];
        this.widgets = [];
        this.isLoading = false;
    }
    HomeComponent.prototype.ngOnInit = function () {
        // initDemo();
        this.showData();
        $.getScript('../../assets/js/sidebar-moving-tab.js');
    };
    HomeComponent.prototype.getData = function () {
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
    HomeComponent.prototype.showData = function () {
        var _this = this;
        var arr = [];
        var lwidget = {};
        this.getData().subscribe(function (res) {
            _this.isLoading = false;
            _this.widgets = res;
            _this.widgetNumber = _this.widgets.length;
        }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.getData().subscribe(function (data) {
                        self.isLoading = false;
                        self.widgets = data;
                        self.widgetNumber = self.widgets.length;
                    });
                });
            }
        });
    };
    HomeComponent.prototype.setBack = function () {
        this.nav.isGoBack = true;
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home-cmp',
            moduleId: module.id,
            templateUrl: 'home.component.html'
        }), 
        __metadata('design:paramtypes', [nav_service_1.NavService, http_1.Http, config_service_1.ConfigService, auth_service_1.AuthService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map