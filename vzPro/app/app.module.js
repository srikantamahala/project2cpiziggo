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
var common_1 = require('@angular/common');
var platform_browser_1 = require('@angular/platform-browser');
var router_1 = require('@angular/router');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { MaterialModule } from '@angular/material';
var app_component_1 = require('./app.component');
var dashboard_component_1 = require('./dashboard/dashboard.component');
var dashboard_module_1 = require('./dashboard/dashboard.module');
var locationlist_component_1 = require('./dashboard/locations/locationlist.component');
var eachlocation_component_1 = require('./dashboard/eachlocation/eachlocation.component');
var sidebar_module_1 = require('./sidebar/sidebar.module');
var footer_module_1 = require('./shared/footer/footer.module');
var navbar_module_1 = require('./shared/navbar/navbar.module');
var lights_component_1 = require('./dashboard/lights/lights.component');
var thermo_component_1 = require('./dashboard/thermostats/thermo.component');
var switches_component_1 = require('./dashboard/switches/switches.component');
var nav_service_1 = require('./services/nav.service');
var login_component_1 = require('./dashboard/login/login.component');
var auth_service_1 = require('./services/auth.service');
var config_service_1 = require('./services/config.service');
var auth_guard_service_1 = require('./services/auth-guard.service');
var angular2_color_picker_1 = require('angular2-color-picker');
var homelocation_component_1 = require('./dashboard/homelocation/homelocation.component');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                dashboard_module_1.DashboardModule,
                sidebar_module_1.SidebarModule,
                navbar_module_1.NavbarModule,
                footer_module_1.FooterModule,
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                angular2_color_picker_1.ColorPickerModule,
                // BrowserAnimationsModule,
                // MaterialModule,
                router_1.RouterModule.forRoot([])
            ],
            declarations: [login_component_1.LoginComponent, app_component_1.AppComponent, dashboard_component_1.DashboardComponent, locationlist_component_1.LocationlistComponent, homelocation_component_1.HomelocationComponent, eachlocation_component_1.EachLocationComponent, lights_component_1.LightComponent, thermo_component_1.ThermoComponent, switches_component_1.SwitchComponent],
            providers: [{ provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy }, nav_service_1.NavService, auth_service_1.AuthService, auth_guard_service_1.AuthGuard, config_service_1.ConfigService],
            bootstrap: [app_component_1.AppComponent],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map