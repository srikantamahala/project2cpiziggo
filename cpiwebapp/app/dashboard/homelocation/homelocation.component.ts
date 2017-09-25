import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { NavService } from '../../services/nav.service';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { ConfigService } from './../../services/config.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
declare var $:any;

@Component({
    selector: 'homelocation-cmp',
    moduleId: module.id,
    templateUrl: 'homelocation.component.html',
    animations: [
       trigger(
            'deviceAnimation',
        [
        transition(
        ':enter', [
          style({transform: 'translateY(100%)', opacity: 0}),
          animate('800ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      )]
      
       )
    ],
})

export class HomelocationComponent implements OnInit{
    isLoading:boolean = false;
    error: any;
    widgets:any;
    hideAll:boolean = false;
    constructor(private nav:NavService, private _http: Http, private configUrl: ConfigService,
    private auth: AuthService, private _router: Router){}
    ngOnInit(){
        this.auth.isShowDemo = true;
        this.showData();
    }
    goPreviousView(){
       this.auth.isShowDemo = false;
       this._router.navigate(['dashboard']);
       //window.history.back();
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
    typeWidget:any;
    setTypeWidget(widget){
        this.showIndex = "";
        this.hideAll = true;
        this.typeWidget = widget;
    }
    getTypeWidget(widget){
        return this.typeWidget == widget;
    }
    showIndex:any;
    showControl(i){
       return i == this.showIndex;
    }
    showWidget(i){
        this.showIndex = (this.showIndex == i) ? "":i;
    }
    deviceName(name){
        var name = name.substring(0, 14);
        return name;
    }
    bulbstyle(index){
        if(index == 0){
            return {"margin-left":"50%", "margin-top":"250px", "cursor":"pointer", "position":"absolute"}
        } 
        if(index == 1){
            return {"margin-left":"15%", "margin-top":"220px", "cursor":"pointer","position":"absolute"}
        }
         if(index == 2){
            return {"margin-left":"70%", "margin-top":"150px", "cursor":"pointer", "position":"absolute"}
        }
    }
    
    popupstyle(index){
        if(index == 0){
            return {"margin-left":"55%", "margin-top":"190px", "cursor":"pointer", "position":"absolute"}
        } 
        if(index == 1){
            return {"margin-left":"20%", "margin-top":"140px", "cursor":"pointer","position":"absolute"}
        }
         if(index == 2){
            return {"margin-left":"75%", "margin-top":"70px", "cursor":"pointer", "position":"absolute"}
        }
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
    showData(){
      this.getData().subscribe((res) => {
          this.isLoading = false;
          this.widgets = res; 
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
          }  
        },
         (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.getData().subscribe((data)=>{
                            self.isLoading = false;
                            self.widgets = data;
                             for(let i=0;i<self.widgets.length;i++){
                                if(self.widgets[i].state != "No State In CPI "){
                                    self.widgets[i].state = JSON.parse(self.widgets[i].state);
                                    self.widgets[i].state.bri = self.widgets[i].state.bri == null ? 0 : self.widgets[i].state.bri;
                                    self.widgets[i].state.sat = self.widgets[i].state.sat == null ? 0 : self.widgets[i].state.sat;
                                    self.widgets[i].showProfile = false;
                                } else {
                                    self.widgets[i].state = {}
                                    self.widgets[i].state.on = true;
                                    self.widgets[i].state.bri = 0;
                                    self.widgets[i].state.sat = 0;
                                    self.widgets[i].state.hue = 1000;
                                    self.widgets[i].state.reachable = true;
                                }
                            }
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
}
