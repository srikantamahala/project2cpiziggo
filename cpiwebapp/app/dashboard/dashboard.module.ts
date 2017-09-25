import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './dashboard.routes';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core' ;

@NgModule({
    imports: [
        RouterModule.forChild(MODULE_ROUTES)
    ],
    declarations: [ MODULE_COMPONENTS ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})

export class DashboardModule{}
