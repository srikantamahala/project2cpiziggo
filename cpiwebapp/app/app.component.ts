import { Component, OnInit } from '@angular/core';
import {LocationStrategy, PlatformLocation, Location} from '@angular/common';
import { NavService } from './services/nav.service';
import { AuthService } from './services/auth.service';

declare var $:any;

@Component({
    selector: 'my-app',
    moduleId: module.id,
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit{
    location: Location;
    constructor(location:Location, private nav: NavService, private auth: AuthService ) {
        this.location = location;
    }
    ngOnInit(){
        $.getScript('../assets/js/material-dashboard.js');
        $.getScript('../assets/js/initMenu.js');
    }
    public isMaps(path){
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice( 1 );
        if(path == titlee){
            return false;
        }
        else {
            return true;
        }
    }
    Loggedin(){
       if(this.auth.getLogin()){
           return true;
       } else {
           return false;
       }
    }
    showDemo(){
        if(this.auth.isShowDemo){
            return true;
        } else {
            return false;
        }
    }
   
}
