import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import initDemo = require('../../../assets/js/charts.js');
import { NavService } from '../../services/nav.service';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { ConfigService } from './../../services/config.service';
import { AuthService } from './../../services/auth.service';
declare var $:any;

@Component({
    selector: 'home-cmp',
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit{
    allWidgets: any = [];
    widgets: any = [];
    isLoading: boolean = false;
    widgetNumber: any;
    constructor(private nav:NavService, private _http: Http, private configUrl: ConfigService,
    private auth: AuthService,){}
    ngOnInit(){
        // initDemo();
        this.showData();
        $.getScript('../../assets/js/sidebar-moving-tab.js');
    }
    getData(){
        let headers = new Headers();  
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "includeState=true&includeCapability=true";
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
      this.isLoading = true;
      return this._http.get(this.configUrl.apiPath+'/cpi/devices/profiles', options)
         .map((response: Response)=> response.json())
    }
    error: any;
    showData(){
      let arr = [];
      let lwidget = {}
      this.getData().subscribe((res) => {
          this.isLoading = false;
          this.widgets = res;
          this.widgetNumber = this.widgets.length;
          
        },
         (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.getData().subscribe((data)=>{
                            self.isLoading = false;
                            self.widgets = data;
                            self.widgetNumber = self.widgets.length;
                       })
                    })
               
                }
            })
    }
    setBack(){
       this.nav.isGoBack = true;
    }
}
