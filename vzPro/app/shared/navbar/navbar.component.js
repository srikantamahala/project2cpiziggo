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
var sidebar_routes_config_1 = require('../.././sidebar/sidebar-routes.config');
var common_1 = require('@angular/common');
var nav_service_1 = require('../../services/nav.service');
var auth_service_1 = require('../../services/auth.service');
var router_1 = require('@angular/router');
var NavbarComponent = (function () {
    function NavbarComponent(location, nav, _router, auth) {
        this.nav = nav;
        this._router = _router;
        this.auth = auth;
        this.loggedPerson = localStorage.getItem("uname");
        this.location = location;
    }
    NavbarComponent.prototype.ngOnInit = function () {
        this.listTitles = sidebar_routes_config_1.ROUTES.filter(function (listTitle) { return listTitle; });
    };
    NavbarComponent.prototype.getTitle = function () {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        // return 'Dashboard';
    };
    NavbarComponent.prototype.logout = function () {
        this.auth.setLogout();
        this._router.navigate(['login']);
    };
    NavbarComponent.prototype.getGoBack = function () {
        //return this.nav.isGoBack;
        var titlei = this.location.prepareExternalUrl(this.location.path());
        if (titlei.charAt(0) === '#') {
            titlei = titlei.slice(2);
        }
        return titlei == 'lights' || titlei == 'thermostats' || titlei == 'switches';
    };
    NavbarComponent.prototype.resetGoBack = function () {
        this.nav.resetGoBack();
        this._router.navigate(['dashboard']);
    };
    NavbarComponent.prototype.Loggedin = function () {
        return this.auth.getLogin();
    };
    NavbarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'navbar-cmp',
            templateUrl: 'navbar.component.html'
        }), 
        __metadata('design:paramtypes', [common_1.Location, nav_service_1.NavService, router_1.Router, auth_service_1.AuthService])
    ], NavbarComponent);
    return NavbarComponent;
}());
exports.NavbarComponent = NavbarComponent;
//# sourceMappingURL=navbar.component.js.map