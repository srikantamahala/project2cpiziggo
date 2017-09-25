import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavService } from './../../services/nav.service';
import {ColorPickerService} from 'angular2-color-picker';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { AuthService } from './../../services/auth.service';
import { ConfigService } from './../../services/config.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $:any;

@Component({
    selector: 'light-cmp',
    moduleId: module.id,
    templateUrl: 'lights.component.html'
})

export class LightComponent implements OnInit{
    widgets: any = [];
    allWidgets: any = [];
    colorRange: any;
    disableColor: any;
    noLights: any = false;
    newWidgetState: any = [];
    onoff: boolean;
    bulbcolor: any;
    bulbBrightness: any;
    private color: string = "#127bdc";
    isLoading: boolean = false;
    forLoading: boolean = false;
    showProfile: boolean = false;
    private _setIntervalHandler: any;
    constructor(nav:NavService, private cpService: ColorPickerService, private _http: Http,
    private auth: AuthService, private router: Router, private route: ActivatedRoute,
    private configUrl: ConfigService){}
    ngOnInit(){
        sessionStorage.setItem("stateData","");
        this.showData();
        if(this.configUrl.autoRefresh == true){
            let self = this;
            this._setIntervalHandler = setInterval(() => {
                if(sessionStorage.getItem("stateData") == undefined){
                    clearInterval(self._setIntervalHandler);
                } else {
                    self.showData();
                }
            }, 10000)
            
        }
        
    }
    ngOnDestroy() {
       clearInterval(this._setIntervalHandler);
    }
    hidePopup(e){
       $(e.target).parent().find(".color-picker").toggle();
    }
    roundUpBrightness(bright){
        return Math.round((bright/254)*100);
    }
    roundUpSaturation(saturation){
        return Math.round((saturation/254)*100);
    }
    deviceIcon(devicetype, thisDeviceType){
        return devicetype == thisDeviceType;
    }
    checkCapable(capablelist,capable){
        let capablelistItems = []
        for(let i=0;i<capablelist.length;i++){
            capablelistItems.push(capablelist[i].capabilityName)
        }
        if(capablelistItems.indexOf(capable) > -1){
            return true;
        }
    }
    showProfilePopup(widget){
        widget.showProfile = true;
    }
    backToControls(widget){
        widget.showProfile = false;
    }
    showPublicProfile(type){
       return type == "PUBLIC";
    }
    deviceName(name){
        var name = name.substring(0, 14);
        return name;
    }
    getData(){
        let headers = new Headers();  
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "includeState=true&includeCapability=true";
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
      if(this.forLoading == false){
         this.isLoading = true;
      }
      return this._http.get(this.configUrl.apiPath+'/cpi/devices/profiles', options)
         .map((response: Response)=> response.json())
    }
    
    templateData(res){
         let arr = [];
         let lwidget = {}
         this.widgets = res;
          if(this.widgets.length == 0){
              this.noLights = true;
          } else {
              this.noLights = false;
          }
          for(let i=0;i<this.widgets.length;i++){
              if(this.widgets[i].state != "No State In CPI "){
                  this.widgets[i].state = JSON.parse(this.widgets[i].state);
                  this.widgets[i].state.bri = this.widgets[i].state.bri == null ? 0 : this.widgets[i].state.bri;
                  this.widgets[i].state.sat = this.widgets[i].state.sat == null ? 0 : this.widgets[i].state.sat;
                  this.widgets[i].showProfile = false;
              } else {
                  this.widgets[i].state = {}
                  this.widgets[i].state.on = true;
                  this.widgets[i].state.bri = 0;
                  this.widgets[i].state.sat = 0;
                  this.widgets[i].state.hue = 1000;
                  this.widgets[i].state.reachable = true;
              }
              
               arr.push(this.widgets[i].state);
          }
          let totalArray = "";
          for(let k=0;k<arr.length;k++){
              let j = JSON.stringify(arr[k]);
              totalArray = totalArray.concat(j);
          }
          let totalNewState = sessionStorage.getItem("stateData");
          if(totalNewState != ""){
              totalNewState = JSON.parse(totalNewState);
          }
          let totalNewState1 = "";
          if(totalNewState != undefined){
              for(let z=0;z<totalNewState.length;z++){
                    let m = JSON.stringify(totalNewState[z]);
                    totalNewState1 = totalNewState1.concat(m);
              }
          }
          if(totalArray != totalNewState1){
             this.allWidgets = this.widgets;
             sessionStorage.setItem("stateData", JSON.stringify(arr));
          } else {
              console.log("equal")
          }

    }
    showData(){
      this.getData().subscribe((res) => {
          this.forLoading = true;
          this.isLoading = false;
          this.templateData(res);
          
        },
         (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.getData().subscribe((data)=>{
                            self.forLoading = true;
                            self.isLoading = false;
                            self.templateData(data);
                       })
                    })
               
                }
            })
    }

    putOnorOff(onof,deviceId) {
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "userName="+localStorage.getItem("uname");
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let on = onof == true ? "switch" : "switch"
        let switchon = onof == true ? "ON" : "OFF"
        let data= {
            "deviceId":deviceId,
            "actionType":on,
            "command":switchon
        }
        let url2 = this.configUrl.apiPath+'/cpi/commands'
             return this._http
                .post(url2, data, options)
                .map(res => res.json());
       
    }
    data: any;
    error: any;
    showOnorOff(onof,deviceId){
          this.putOnorOff(onof,deviceId).subscribe(
            (data) =>{
                console.log(data);
            },
           (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putOnorOff(onof,deviceId).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }

    putChangeColor(color,deviceId) {
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "userName="+localStorage.getItem("uname");
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let data= {
            "deviceId":deviceId,
            "actionType":"hue",
            "command":color.toString()
        }
        let url = this.configUrl.apiPath+'/cpi/commands';
        return this._http
                    .post(url, data, options)
                    .map(res => res.json());
    }
    showChangeColor(color,deviceId){
          this.putChangeColor(color,deviceId).subscribe(
            (data) => this.data = data,
            (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putChangeColor(color,deviceId).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }

    putChangeBrightness(bright,deviceId) {
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "userName="+localStorage.getItem("uname");
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let data= {
             "deviceId":deviceId,
             "actionType":"bri",
             "command":bright.toString()
        }
        let url = this.configUrl.apiPath+'/cpi/commands';
        //let url1 = 'http://jsonplaceholder.typicode.com/posts/1';
        return this._http
                    .post(url, data, options)
                    .map(res => res.json());
    }
    showChangeBrightness(bright,deviceId){
          this.putChangeBrightness(bright,deviceId).subscribe(
            (data) => this.data = data,
           (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putChangeBrightness(bright,deviceId).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }

     putChangeSaturation(saturation,deviceId) {
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "userName="+localStorage.getItem("uname");
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let data= {
            "deviceId":deviceId,
            "actionType":"sat",
            "command":saturation.toString()
        }
        let url = this.configUrl.apiPath+'/cpi/commands';
        //let url1 = 'http://jsonplaceholder.typicode.com/posts/1';
        return this._http
                    .post(url, data, options)
                    .map(res => res.json());
    }
    showChangeSaturation(saturation,deviceId){
          this.putChangeSaturation(saturation,deviceId).subscribe(
            (data) => this.data = data,
           (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putChangeSaturation(saturation,deviceId).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }
  
}
