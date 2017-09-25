import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    // "http://14.192.18.138:9090" //dev
    //http://14.192.18.142:7070 //QA
   apiPath: any = "http://14.192.18.142:7070"
   autoRefresh: boolean = false;
}