import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { LightComponent } from './lights/lights.component';
import { ThermoComponent } from './thermostats/thermo.component';
import { SwitchComponent } from './switches/switches.component';
import { LoginComponent } from './login/login.component';
import { LocationlistComponent } from './locations/locationlist.component';
import { EachLocationComponent } from './eachlocation/eachlocation.component';
import { HomelocationComponent } from './homelocation/homelocation.component';
import { AuthGuard } from './../services/auth-guard.service';

export const MODULE_ROUTES: Route[] =[
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'locations', component: LocationlistComponent, canActivate: [AuthGuard] },
    { path: 'eachlocation', component: EachLocationComponent, canActivate: [AuthGuard] },
    { path: 'lights', component: LightComponent, canActivate: [AuthGuard] },
    { path: 'thermostats', component: ThermoComponent, canActivate: [AuthGuard] },
    { path: 'switches', component: SwitchComponent, canActivate: [AuthGuard] },
    { path: 'homelocation', component: HomelocationComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard]}, 
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
]

export const MODULE_COMPONENTS = [
    HomeComponent,
    UserComponent
]
