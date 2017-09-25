import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar-routes.config';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { NavService } from '../../services/nav.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    loggedPerson: any = localStorage.getItem("uname");
    constructor(location:Location, private nav: NavService, private _router: Router, private auth: AuthService) {
        this.location = location;
    }
    ngOnInit(){
        this.listTitles = ROUTES.filter(listTitle => listTitle);
    }
    getTitle(){
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if(titlee.charAt(0) === '#'){
            titlee = titlee.slice( 2 );
        }
        for(var item = 0; item < this.listTitles.length; item++){
            if(this.listTitles[item].path === titlee){
                return this.listTitles[item].title;
            }
        }
        // return 'Dashboard';
    }
    
    logout(){
       this.auth.setLogout();
        this._router.navigate(['login']);
    }

    getGoBack(){
        //return this.nav.isGoBack;
        var titlei = this.location.prepareExternalUrl(this.location.path());
        if(titlei.charAt(0) === '#'){
            titlei = titlei.slice( 2 );
        }
        return titlei == 'lights' || titlei == 'thermostats' || titlei == 'switches';
    }
    resetGoBack(){
        this.nav.resetGoBack();
        this._router.navigate(['dashboard']);
    }
    Loggedin(){
       return this.auth.getLogin();
    }
}
