import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { Router } from '@angular/router';

declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    constructor(private _router: Router){}
    public menuItems: any[];
    ngOnInit() {
        $.getScript('../../assets/js/sidebar-moving-tab.js');
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.menuItems = [
            { path: 'dashboard', title: 'Devices',  icon: 'dashboard', class: '' },
            { path: 'locations', title: 'Locations',  icon: 'place', class: '' },
            { path: 'user', title: 'Settings',  icon:'person', class: '' },
            { path: 'homelocation', title: 'Homelocation',  icon:'place', class: '' },
        ]
    }
}
