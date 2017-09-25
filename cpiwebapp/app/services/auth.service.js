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
require('rxjs/add/operator/map');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var config_service_1 = require('./../services/config.service');
// import { tokenNotExpired } from 'angular2-jwt';
var AuthService = (function () {
    function AuthService(http, router, configUrl) {
        this.http = http;
        this.router = router;
        this.configUrl = configUrl;
        this.isShowDemo = false;
    }
    AuthService.prototype.login = function () {
        this.isLoggedin = false;
        // var headers = new Headers();
        // var creds = 'name='+usercreds.username+ '&password'+usercreds.password;
        // headers.append('Content-type', 'application/X-www-form=urlencoaded');
        //return new Promise((resolve)=>{
        // this.http.post('http://localhost:4200/authenticate', creds, {headers: headers}).subscribe((data)=>{
        //    if(data.json().success){
        //       window.localStorage.setItem('auth_key', data.json().token);
        //       this.isLoggedin = true;
        //       resolve(this.isLoggedin);
        //     }
        //  })
        return this.http.get('./assets/datam.json')
            .map(function (response) { return response.json(); });
        // return new Promise((resolve)=>{
        //     this.http.get('./assets/datam.json').subscribe((data)=>{
        //         resolve(data);
        //     })
        // })
        //})
        // var creds = {"deviceid": "xyz"}
        // return new Promise((resolve)=>{
        // return this.http.post('http://10.22.33.164:80/api/', creds)
        //     .map((response: Response)=> response.json())
        //})
    };
    AuthService.prototype.loggedIn = function () {
        // return tokenNotExpired();
    };
    AuthService.prototype.setLogin = function (z) {
        localStorage.setItem('auth_key', z);
    };
    AuthService.prototype.getLogin = function () {
        var token = localStorage.getItem("token");
        if (token) {
            var authToken = JSON.parse(token);
            if (authToken.access_token != "") {
                return true;
            }
        }
        else {
            return false;
        }
    };
    AuthService.prototype.setLogout = function () {
        //localStorage.setItem('auth_key', "");
        //localStorage.setItem("token", "");
        localStorage.removeItem("token");
        localStorage.removeItem("thisElement");
        localStorage.removeItem("uname");
        sessionStorage.removeItem("stateData");
        sessionStorage.removeItem("locstateData");
    };
    AuthService.prototype.setToken = function (data) {
        localStorage.removeItem("token");
        localStorage.setItem("token", JSON.stringify(data));
    };
    AuthService.prototype.getToken = function () {
        var token = localStorage.getItem("token");
        if (token) {
            var authToken = JSON.parse(token);
            return authToken.access_token;
        }
        else {
            return false;
        }
    };
    AuthService.prototype.getRefreshToken = function () {
        var token = localStorage.getItem("token");
        var authToken = JSON.parse(token);
        return authToken.refresh_token;
    };
    AuthService.prototype.setNewToken = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var params = "refresh_token=" + _this.getRefreshToken() + "&client_id=cpi&grant_type=refresh_token";
            var options = new http_1.RequestOptions({
                search: new http_1.URLSearchParams(params)
            });
            var data = {};
            _this.http.post(_this.configUrl.apiPath + '/cpiauthenticator/api/tokens', data, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                if (data.access_token) {
                    _this.setToken(data);
                    resolve(data);
                }
            }, function (err) {
                if (err.json().error_description.split(':')[0] == "Invalid refresh token" || err.json().error == "invalid_grant" ||
                    err.json().error_description.split(':')[0] == "Invalid refresh token (expired)") {
                    _this.setLogout();
                    _this.isShowDemo = false;
                    _this.router.navigate(['login']);
                }
            });
        });
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, router_1.Router, config_service_1.ConfigService])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map