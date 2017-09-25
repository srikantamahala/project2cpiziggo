"use strict";
var home_component_1 = require('./home/home.component');
var user_component_1 = require('./user/user.component');
var lights_component_1 = require('./lights/lights.component');
var thermo_component_1 = require('./thermostats/thermo.component');
var switches_component_1 = require('./switches/switches.component');
var login_component_1 = require('./login/login.component');
var locationlist_component_1 = require('./locations/locationlist.component');
var eachlocation_component_1 = require('./eachlocation/eachlocation.component');
var homelocation_component_1 = require('./homelocation/homelocation.component');
var auth_guard_service_1 = require('./../services/auth-guard.service');
exports.MODULE_ROUTES = [
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'dashboard', component: home_component_1.HomeComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'locations', component: locationlist_component_1.LocationlistComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'eachlocation', component: eachlocation_component_1.EachLocationComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'lights', component: lights_component_1.LightComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'thermostats', component: thermo_component_1.ThermoComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'switches', component: switches_component_1.SwitchComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'homelocation', component: homelocation_component_1.HomelocationComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'user', component: user_component_1.UserComponent, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
exports.MODULE_COMPONENTS = [
    home_component_1.HomeComponent,
    user_component_1.UserComponent
];
//# sourceMappingURL=dashboard.routes.js.map