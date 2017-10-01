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
var router_1 = require('@angular/router');
var auth_service_1 = require('./../../services/auth.service');
var config_service_1 = require('./../../services/config.service');
var http_1 = require('@angular/http');
var LoginComponent = (function () {
    function LoginComponent(nav, _router, auth, http, configurl) {
        this.nav = nav;
        this._router = _router;
        this.auth = auth;
        this.http = http;
        this.configurl = configurl;
        this.uname = "";
        this.pwd = "";
        this.unamerequired = false;
        this.pwdrequired = false;
        this.invaliduname = false;
        this.unexpectedError = false;
        localStorage.removeItem("token");
        this.auth.setLogout();
    }
    LoginComponent.prototype.ngOnInit = function () { };
    LoginComponent.prototype.submitLogin = function (event) {
        var key = event.which || event.keyCode;
        if (key == 13) {
            this.goLogin();
        }
    };
    LoginComponent.prototype.goLogin = function () {
        var _this = this;
        //  this.auth.setLogin(s);
        //  this._router.navigate(['dashboard']);
        this.unamerequired = false;
        this.pwdrequired = false;
        this.invaliduname = false;
        this.unexpectedError = false;
        if (this.uname == "") {
            this.unamerequired = true;
        }
        else {
            this.unamerequired = false;
        }
        if (this.pwd == "") {
            this.pwdrequired = true;
        }
        else {
            this.pwdrequired = false;
        }
        var headers = new http_1.Headers();
        //         headers.append('Content-Type', 'application/json');
        //         headers.append('Access-Control-Allow-Origin', '*');
        //         headers.append('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        //         headers.append('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
        localStorage.setItem("uname", this.uname);
        var params = "client_id=cpi&grant_type=password&username=" + this.uname + "&password=" + this.pwd;
        var options = new http_1.RequestOptions({
            headers: headers,
            search: new http_1.URLSearchParams(params)
        });
        var data = {};
        return this.http.post(this.configurl.apiPath + '/cpiauthenticator/api/tokens', data, options)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            if (data.access_token) {
                _this.auth.setToken(data);
                _this._router.navigate(['dashboard']);
            }
            else {
                if (_this.unamerequired == false && _this.pwdrequired == false && _this.invaliduname == false) {
                    _this.unexpectedError = true;
                }
            }
        }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_grant") {
                if (_this.unamerequired == false && _this.pwdrequired == false) {
                    _this.invaliduname = true;
                }
            }
            else {
                if (_this.unamerequired == false && _this.pwdrequired == false && _this.invaliduname == false) {
                    _this.unexpectedError = true;
                }
            }
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login-cmp',
            moduleId: module.id,
            templateUrl: 'login.component.html'
        }), 
        __metadata('design:paramtypes', [nav_service_1.NavService, router_1.Router, auth_service_1.AuthService, http_1.Http, config_service_1.ConfigService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map