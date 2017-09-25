import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Router } from '@angular/router';
import { ConfigService } from './../services/config.service';
// import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  constructor(private http: Http, private router: Router, private configUrl: ConfigService ) { }

  isLoggedin: boolean;
  isShowDemo: boolean = false;

  login(){
     this.isLoggedin = false;
    // var headers = new Headers();
    // var creds = 'name='+usercreds.username+ '&password'+usercreds.password;
    // headers.append('Content-type', 'application/X-www-form=urlencoaded');
    //return new Promise((resolve)=>{
        // this.http.post('http://localhost:4200/authenticate', creds, {headers: headers}).subscribe((data)=>{
        //    if(data.json().success){
        //       window.localStorage.setItem('auth_key', data.json().token);
        //       this.isLoggedin = true;
        //       resolve(this.isLoggedin);
        //     }
        //  })
          return this.http.get('./assets/datam.json')
            .map((response: Response)=> response.json())
        // return new Promise((resolve)=>{
        //     this.http.get('./assets/datam.json').subscribe((data)=>{
        //         resolve(data);
        //     })
        // })
    //})
    // var creds = {"deviceid": "xyz"}
    // return new Promise((resolve)=>{
      // return this.http.post('http://10.22.33.164:80/api/', creds)
      //     .map((response: Response)=> response.json())
    //})
  }

  loggedIn() {
    // return tokenNotExpired();
  }

  isGoBack: boolean;

  setLogin(z){
    localStorage.setItem('auth_key', z);
  }

  getLogin(){
    let token = localStorage.getItem("token");
    if(token){
       let authToken = JSON.parse(token);
       if(authToken.access_token != ""){
           return true;
       }
    } else {
      return false;
    }
  }
  setLogout(){
    //localStorage.setItem('auth_key', "");
    //localStorage.setItem("token", "");
    localStorage.removeItem("token");
    localStorage.removeItem("thisElement");
    localStorage.removeItem("uname");
    sessionStorage.removeItem("stateData");
    sessionStorage.removeItem("locstateData");
  }

  setToken(data){
    localStorage.removeItem("token");
    localStorage.setItem("token", JSON.stringify(data))
  }

  getToken(){
    let token = localStorage.getItem("token");
    if(token){
       let authToken = JSON.parse(token);
       return authToken.access_token;
    } else {
      return false;
    }
    
  }
  getRefreshToken(){
    let token = localStorage.getItem("token");
    let authToken = JSON.parse(token);
    return authToken.refresh_token;
  }

  setNewToken(){
    return new Promise((resolve)=>{
      let params = "refresh_token="+this.getRefreshToken()+"&client_id=cpi&grant_type=refresh_token"
        let options = new RequestOptions({
            search: new URLSearchParams(params)
        });
        let data = {};
        this.http.post(this.configUrl.apiPath+'/cpiauthenticator/api/tokens', data, options)
            .map(res => res.json())
            .subscribe(
            (data) => {
                if(data.access_token) {
                    this.setToken(data);
                    resolve(data);
                }  
            },
            (err) => {
              if (err.json().error_description.split(':')[0] == "Invalid refresh token" || err.json().error == "invalid_grant" ||
              err.json().error_description.split(':')[0] == "Invalid refresh token (expired)"){
                  this.setLogout();
                  this.isShowDemo = false;
                  this.router.navigate(['login']);
              }
              
            });  
    })
        
  }

}
