import { HttpHeaders } from 'next/config';
import { BehaviorSubject } from 'rxjs';

import getConfig from 'next/config';
import { localStorageService, LocalStorageVars } from 'services/LocalStorage';
const { publicRuntimeConfig } = getConfig();


export class HttpUtilsService {
  public apiUrl: string;
  public isAuthenticated$ = new BehaviorSubject(false);

  private tokenType?: string;
  private accessToken?: string;

  //TO DO : CHANGE CONSTRUCTOR TO FUNCTION INJECTION
  constructor() {
    this.tokenType = localStorageService.read(LocalStorageVars.TOKEN_TYPE);
    this.accessToken = localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
    if (this.tokenType && this.accessToken) {
      this.isAuthenticated$.next(true);
    }

    this.apiUrl = publicRuntimeConfig.apiUrl;
    if (this.apiUrl.indexOf('<front-host>') >= 0) {
      this.apiUrl = this.apiUrl.replace('<front-host>', window.location.hostname);
    }
  }  

  public setAccessToken(tokenType?: string, accessToken?: string) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    if (this.tokenType && this.accessToken) {
      localStorageService.save(LocalStorageVars.TOKEN_TYPE, this.tokenType);
      localStorageService.save(LocalStorageVars.ACCESS_TOKEN, this.accessToken);
      this.isAuthenticated$.next(true);
    } else {
      localStorageService.remove(LocalStorageVars.TOKEN_TYPE);
      localStorageService.remove(LocalStorageVars.ACCESS_TOKEN);
      this.isAuthenticated$.next(false);
    }
  }

  // public getHttpOptions(isJson = true) {
  //   let headers = new HttpHeaders();
  //
  //   if (isJson) {
  //     headers = headers.set('Content-Type', 'application/json');
  //   }
  //
  //   if (this.tokenType && this.accessToken) {
  //     headers = headers.set('Authorization', `${this.tokenType} ${this.accessToken}`);
  //   }
  //
  //   const httpOptions = {
  //     headers
  //   };
  //
  //   return httpOptions;
  // }
}
