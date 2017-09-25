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
var initDemo = require('../../../assets/js/charts.js');
var nav_service_1 = require('../../services/nav.service');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var auth_service_1 = require('./../../services/auth.service');
var config_service_1 = require('./../../services/config.service');
var LocationlistComponent = (function () {
    function LocationlistComponent(nav, http, auth, router, configUrl) {
        this.nav = nav;
        this.http = http;
        this.auth = auth;
        this.router = router;
        this.configUrl = configUrl;
        this.locationlist = [];
        this.isLoading = false;
        this.showLocation();
    }
    LocationlistComponent.prototype.ngOnInit = function () {
        initDemo();
    };
    LocationlistComponent.prototype.setBack = function () {
        this.nav.isGoBack = true;
    };
    LocationlistComponent.prototype.getLocation = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer " + this.auth.getToken());
        this.isLoading = true;
        return this.http.get(this.configUrl.apiPath + '/cpi/locations', { headers: headers })
            .map(function (response) { return response.json(); });
    };
    LocationlistComponent.prototype.showLocation = function () {
        var _this = this;
        this.getLocation().subscribe(function (res) {
            _this.isLoading = false;
            _this.locationlist = res.locations;
        }, function (err) {
            var self = _this;
            _this.error = err;
            if (_this.error.json().error == "invalid_token") {
                _this.auth.setNewToken().then(function (res) {
                    self.getLocation().subscribe(function (data) {
                        self.isLoading = false;
                        self.locationlist = data.locations;
                    });
                });
            }
        });
    };
    LocationlistComponent.prototype.viewLocationDevices = function (locationid, locationname) {
        this.router.navigate(['/eachlocation'], { queryParams: { location: locationid, locationName: locationname } });
    };
    LocationlistComponent = __decorate([
        core_1.Component({
            selector: 'locationlist-cmp',
            moduleId: module.id,
            templateUrl: 'locationlist.component.html'
        }), 
        __metadata('design:paramtypes', [nav_service_1.NavService, http_1.Http, auth_service_1.AuthService, router_1.Router, config_service_1.ConfigService])
    ], LocationlistComponent);
    return LocationlistComponent;
}());
exports.LocationlistComponent = LocationlistComponent;
//# sourceMappingURL=locationlist.component.js.map