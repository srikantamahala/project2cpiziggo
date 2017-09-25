import { Component, OnInit } from '@angular/core';
import { NavService } from './../../services/nav.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ConfigService } from './../../services/config.service';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';

declare var $:any;

@Component({
    selector: 'login-cmp',
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit{
    constructor(private nav:NavService, private _router: Router, private auth: AuthService, private http: Http, private configurl: ConfigService){
        localStorage.removeItem("token");
        this.auth.setLogout();
    }
    uname: string = "";
    pwd: string = "";
    data: any;
    error: any;
    unamerequired: boolean = false;
    pwdrequired: boolean = false;
    invaliduname: boolean = false;
    unexpectedError: boolean = false;
    
    ngOnInit(){}
    submitLogin(event){
       let key = event.which || event.keyCode;
       if(key == 13){
           this.goLogin();
       }
    }
    goLogin(){
        //  this.auth.setLogin(s);
        //  this._router.navigate(['dashboard']);
        this.unamerequired = false;
        this.pwdrequired = false;
        this.invaliduname = false;
        this.unexpectedError = false;
        if(this.uname == ""){
            this.unamerequired = true;
        } else {
            this.unamerequired = false;
        }
        if(this.pwd == ""){
            this.pwdrequired = true;
        } else {
            this.pwdrequired = false;
        }
         let headers = new Headers();  
//         headers.append('Content-Type', 'application/json');
//         headers.append('Access-Control-Allow-Origin', '*');
//         headers.append('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//         headers.append('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
        localStorage.setItem("uname", this.uname);
        let params = "client_id=cpi&grant_type=password&username="+this.uname+"&password="+this.pwd
        let options = new RequestOptions({
            headers: headers,
            search: new URLSearchParams(params)
        });
        let data = {};
        return this.http.post(this.configurl.apiPath+'/cpiauthenticator/api/tokens', data, options)
            .map(res => res.json())
            .subscribe(
            (data) => {
                if(data.access_token) {
                    this.auth.setToken(data);
                    this._router.navigate(['dashboard']);  
                } else {
                   if(this.unamerequired == false && this.pwdrequired == false && this.invaliduname == false){
                        this.unexpectedError = true;
                    }
                }    
            },
            (err) => {
               let self = this;
                this.error = err;
                if(this.error.json().error == "invalid_grant"){
                    if(this.unamerequired == false && this.pwdrequired == false){
                         this.invaliduname = true;
                    }               
                } else {
                    if(this.unamerequired == false && this.pwdrequired == false && this.invaliduname == false){
                        this.unexpectedError = true;
                    }
                }
            });        

    }
   
}
