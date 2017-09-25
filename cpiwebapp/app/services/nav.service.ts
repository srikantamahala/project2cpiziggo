import { Injectable } from '@angular/core';

@Injectable()
export class NavService {

  constructor() { }

  isGoBack: boolean = false;

  goBack(){
      return this.isGoBack;
  }
  resetGoBack(){
      this.isGoBack = false;
  }
  setBack(){
     this.isGoBack = true;
  }
}
