import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import initDemo = require('../../../assets/js/charts.js');
import { NavService } from '../../services/nav.service';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ConfigService } from './../../services/config.service';
declare var $:any;

@Component({
    selector: 'locationlist-cmp',
    moduleId: module.id,
    templateUrl: 'locationlist.component.html'
})

export class LocationlistComponent implements OnInit{
    locationlist: any = [];
    error: any;
    isLoading: boolean = false;
    constructor(private nav:NavService, private http:Http, private auth: AuthService, 
    private router: Router, private configUrl: ConfigService){
        this.showLocation();
    }
    ngOnInit(){
        
        initDemo();
    }
    setBack(){
       this.nav.isGoBack = true;
    }

    getLocation(){
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        this.isLoading = true;
        return this.http.get(this.configUrl.apiPath+'/cpi/locations', {headers: headers})
            .map((response: Response)=> response.json())
    }
    showLocation(){
      this.getLocation().subscribe(
          (res) => {
          this.isLoading = false;    
          this.locationlist = res.locations;
        },
        (err)=> {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.getLocation().subscribe((data)=>{
                           self.isLoading = false;
                           self.locationlist = data.locations;
                       })
                    })
               
                }
            })
    }
    viewLocationDevices(locationid,locationname){
        this.router.navigate(['/eachlocation'], { queryParams: { location: locationid, locationName: locationname } });

    }
}
