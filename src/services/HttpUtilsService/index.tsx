import { HttpHeaders } from 'next/config';
import { BehaviorSubject } from 'rxjs';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();


export class HttpUtilsService {
  public apiUrl: string;
  public isAuthenticated$ = new BehaviorSubject(false);

  private tokenType?: string;
  private accessToken?: string;

  constructor() {
    this.tokenType = window.localStorage.getItem('token_type') || undefined;
    this.accessToken = window.localStorage.getItem('access_token') || undefined;
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
      window.localStorage.setItem('token_type', this.tokenType);
      window.localStorage.setItem('access_token', this.accessToken);
      this.isAuthenticated$.next(true);
    } else {
      window.localStorage.removeItem('token_type');
      window.localStorage.removeItem('access_token');
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
