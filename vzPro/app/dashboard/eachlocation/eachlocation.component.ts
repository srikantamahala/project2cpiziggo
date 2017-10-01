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
    selector: 'eachlocation-cmp',
    moduleId: module.id,
    templateUrl: 'eachlocation.component.html'
})

export class EachLocationComponent implements OnInit, OnDestroy{
    widgets: any = [];
    colorRange: any;
    disableColor: any;
    onoff: boolean;
    bulbcolor: any;
    bulbBrightness: any;
    newWidgetState: any = [];
    devices:any=[];
    alldevices: any = [];
    location: any;
    locationId: any;
    locationName: any;
    errorDescription:any;
    serverError: boolean = false;
    isLoading: boolean = false;
    forLoading: boolean = false;
    private color: string = "#127bdc";
    private _setIntervalHandler: any;
    constructor(nav:NavService, private cpService: ColorPickerService, private _http: Http, 
    private auth: AuthService, private router: Router, private route: ActivatedRoute,
    private configUrl: ConfigService){}
    ngOnInit(){
        // this.showData()
         this.route
            .queryParams
            .subscribe(params => {
                this.locationId = params['location'];
                this.locationName = params['locationName'];
                this.showLocationDevices(this.locationId);
            });
            sessionStorage.setItem("locstateData","");
            if(this.configUrl.autoRefresh == true){
                let self = this;
                this._setIntervalHandler = setInterval(() =>{
                    if(sessionStorage.getItem("locstateData") == undefined){
                        clearInterval(self._setIntervalHandler);
                    } else {
                        self.showLocationDevices(self.locationId);
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
    deviceName(name){
        var name = name.substring(0, 14);
        return name;
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
    getLocationDevices(locationid){
       let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "includeState=true&includeCapability=true";
        //let url = this.configUrl.apiPath+'/cpi/locations/'+locationid;
        let url = this.configUrl.apiPath+"/cpi/locations/"+locationid+"/profiles"
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        if(this.forLoading == false){
           this.isLoading = true;
        }
        return this._http.get(url, options)
            .map((response: Response)=> response.json())
    }
    showLocationData(data){
        let arr = [];
        this.devices = data;
        for(let i=0;i<this.devices.length;i++){
             if(this.devices[i].state != "No State In CPI "){
                this.devices[i].state = JSON.parse(this.devices[i].state);
                this.devices[i].state.bri = this.devices[i].state.bri == null ? 0 : this.devices[i].state.bri;
                this.devices[i].state.sat = this.devices[i].state.sat == null ? 0 : this.devices[i].state.sat;
                this.devices[i].showProfile = false;     
             } else {
                  this.devices[i].state = {}
                  this.devices[i].state.on = true;
                  this.devices[i].state.bri = 0;
                  this.devices[i].state.sat = 0;
                  this.devices[i].state.hue = 1000;
                  this.devices[i].state.reachable = true;
             }
              arr.push(this.devices[i].state);
        }
        let totalArray = "";
        for(let k=0;k<arr.length;k++){
            let j = JSON.stringify(arr[k]);
            totalArray = totalArray.concat(j);
        }
        let totalNewState = sessionStorage.getItem("locstateData");
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
            sessionStorage.setItem("locstateData", JSON.stringify(arr));
            this.alldevices = this.devices;
            //this.newWidgetState = arr.slice();    
        } else {
            console.log("equal")
        }

    }
    handleErrorCode(error){
        if(error.json().errorCode != undefined){
            this.errorDescription = this.error.json().errorList[0];
            this.isLoading = false;
            this.forLoading = true;
            this.serverError = true;
        }
    }
    showLocationDevices(locationid){
        this.getLocationDevices(locationid).subscribe(
            (data) => {
                this.forLoading = true;
                this.isLoading = false;
                this.showLocationData(data);
            },
            (err) => {
                let self = this;
                this.error = err;
                this.handleErrorCode(this.error);
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.getLocationDevices(locationid).subscribe((data)=>{
                            self.isLoading = false;
                            self.forLoading = true;
                            self.showLocationData(data);
                        })
                    })
                
                }
            });
    }

    putOnorOff(onof,deviceid) {
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
            "deviceId":deviceid,
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
    showOnorOff(onof,deviceid){
          this.putOnorOff(onof,deviceid).subscribe(
            (data) =>{
                console.log(data);
            },
           (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putOnorOff(onof,deviceid).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }

    putChangeColor(color,deviceid) {
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "userName="+localStorage.getItem("uname");
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let data= {
            "deviceId":deviceid,
            "actionType":"hue",
            "command":color.toString()
        }
        let url = this.configUrl.apiPath+'/cpi/commands';
        return this._http
                    .post(url, data, options)
                    .map(res => res.json());
    }
    showChangeColor(color,deviceid){
          this.putChangeColor(color,deviceid).subscribe(
            (data) => this.data = data,
            (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putChangeColor(color,deviceid).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }

    putChangeBrightness(bright,deviceid) {
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "userName="+localStorage.getItem("uname");
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let data= {
             "deviceId":deviceid,
             "actionType":"bri",
             "command":bright.toString()
        }
        let url = this.configUrl.apiPath+'/cpi/commands';
        //let url1 = 'http://jsonplaceholder.typicode.com/posts/1';
        return this._http
                    .post(url, data, options)
                    .map(res => res.json());
    }
    showChangeBrightness(bright,deviceid){
          this.putChangeBrightness(bright,deviceid).subscribe(
            (data) => this.data = data,
           (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putChangeBrightness(bright,deviceid).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }

     putChangeSaturation(saturation,deviceid) {
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "bearer "+this.auth.getToken());
        let params = "userName="+localStorage.getItem("uname");
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let data= {
            "deviceId":deviceid,
            "actionType":"sat",
            "command":saturation.toString()
        }
        let url = this.configUrl.apiPath+'/cpi/commands';
        return this._http
                    .post(url, data, options)
                    .map(res => res.json());
    }
    showChangeSaturation(saturation,deviceid){
          this.putChangeSaturation(saturation,deviceid).subscribe(
            (data) => this.data = data,
           (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_token"){
                    this.auth.setNewToken().then(function(res){
                        self.putChangeSaturation(saturation,deviceid).subscribe((data)=>{
                           console.log(data);
                       })
                    })
               
                }
            });
    }
  
}
