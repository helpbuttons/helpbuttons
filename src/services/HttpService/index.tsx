import { BehaviorSubject, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import { alertService } from "services/Alert";


export class HttpService {
  public isAuthenticated$ = new BehaviorSubject(false);

  private apiUrl: string;
  private accessToken?: string;

  //TO DO : CHANGE CONSTRUCTOR TO FUNCTION INJECTION
  constructor() {
    this.accessToken = localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
    if (this.accessToken) {
      this.isAuthenticated$.next(true);
    }

    this.apiUrl = publicRuntimeConfig.apiUrl;
    if (this.apiUrl.indexOf("<front-host>") >= 0) {
      this.apiUrl = this.apiUrl.replace("<front-host>", window.location.hostname);
    }
  }

  public setAccessToken(accessToken?: string) {
    this.accessToken = accessToken;
    if (this.accessToken) {
      localStorageService.save(LocalStorageVars.ACCESS_TOKEN, this.accessToken);
      this.isAuthenticated$.next(true);
    } else {
      localStorageService.remove(LocalStorageVars.ACCESS_TOKEN);
      this.isAuthenticated$.next(false);
    }
  }

  public get<T>(path: string,
                body: object = {},
                headers: object = {},
               ): Observable<T | undefined> {
    const query = new URLSearchParams(body);
    if (query.keys().length > 0) {
      return this._ajax("GET", path + '?' + query.toString(), {}, headers);
    } else {
      return this._ajax("GET", path, {}, headers);
    }
  }

  public post<T>(path: string,
                 body: object = {},
                 headers: object = {},
                ): Observable<T | undefined> {
    return this._ajax("POST", path, body, headers);
  }

  private _ajax<T>(method: string,
                   path: string,
                   body: object,
                   headers: object,
                  ): Observable<T | undefined> {
    return ajax({
      url: this.apiUrl + path,
      method: method,
      body: body,
      headers: {...this._defaultHeaders(), ...headers},
    }).pipe(
      map(result => (result.response as T | undefined)),
      catchError(err => {
        alertService.error("A network error has occurred", {autoClose: true}); // TODO: show a better message to the user
        return of(undefined);
      })
    );
  }

  private _defaultHeaders(): object {
    let headers = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }
}

export const httpService = new HttpService();

