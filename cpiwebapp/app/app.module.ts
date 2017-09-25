import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { MaterialModule } from '@angular/material';
import { AppComponent }   from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { DashboardModule } from './dashboard/dashboard.module';

import { LocationlistComponent } from './dashboard/locations/locationlist.component';
import { EachLocationComponent } from './dashboard/eachlocation/eachlocation.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { LightComponent } from './dashboard/lights/lights.component';
import { ThermoComponent } from './dashboard/thermostats/thermo.component';
import { SwitchComponent } from './dashboard/switches/switches.component';
import { NavService } from './services/nav.service';
import { LoginComponent } from './dashboard/login/login.component';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { AuthGuard } from './services/auth-guard.service';
import { ColorPickerModule } from 'angular2-color-picker';
import { HomelocationComponent } from './dashboard/homelocation/homelocation.component';



@NgModule({
    imports:      [
        BrowserModule,
        DashboardModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        ColorPickerModule,
        // BrowserAnimationsModule,
        // MaterialModule,
        RouterModule.forRoot([])
    ],
    declarations: [ LoginComponent, AppComponent, DashboardComponent, LocationlistComponent, HomelocationComponent,EachLocationComponent, LightComponent, ThermoComponent, SwitchComponent ],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, NavService, AuthService, AuthGuard, ConfigService],
    bootstrap:    [ AppComponent ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})

export class AppModule { }
