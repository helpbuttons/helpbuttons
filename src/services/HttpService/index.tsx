import { BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ajax } from "rxjs/ajax";

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

import { localStorageService, LocalStorageVars } from 'services/LocalStorage';


export class HttpService {
  public isAuthenticated$ = new BehaviorSubject(false);

  private apiUrl: string;
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

  public get<T>(path: string,
                body: object = {},
                headers: object = {},
               ): Observable<T | undefined> {
    return ajax({
      url: this.apiUrl + path,
      method: "GET",
      headers: {...this._defaultHeaders(), ...headers},
    }).pipe(
      map((result) => (result.response as T | undefined)),
      catchError((err) => {
        alert("A network error has occurred, the data could not be read"); // TODO: show a better message to the user
        return of(undefined);
      })
    );
  }

  private _defaultHeaders(): object {
    let headers = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    if (this.tokenType && this.accessToken) {
      headers["Authorization"] = `${this.tokenType} ${this.accessToken}`;
    }

    return headers;
  }
}

export const httpService = new HttpService();

