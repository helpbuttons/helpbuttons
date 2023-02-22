import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import {
  localStorageService,
  LocalStorageVars,
} from 'services/LocalStorage';

export function isHttpError(err: object) {
  return err && err.statusCode && err.message;
}

export class HttpService {
  public isAuthenticated$ = new BehaviorSubject(false);

  private apiUrl: string;
  private accessToken?: string;

  //TO DO : CHANGE CONSTRUCTOR TO FUNCTION INJECTION
  constructor() {
    this.accessToken = localStorageService.read(
      LocalStorageVars.ACCESS_TOKEN,
    );
    if (this.accessToken) {
      this.isAuthenticated$.next(true);
    }
    this.apiUrl = '/api/';
  }
  public getAccessToken()
  {
    return localStorageService.read(
      LocalStorageVars.ACCESS_TOKEN,
    );
  }
  public setAccessToken(accessToken?: string) {
    localStorageService.save(
      LocalStorageVars.ACCESS_TOKEN,
      accessToken.toString(),
    );
    this.isAuthenticated$.next(true);
  }

  public clearAccessToken() {
    console.log('clearning access token')
    localStorageService.remove(LocalStorageVars.ACCESS_TOKEN);
    this.isAuthenticated$.next(false);
  }

  public delete<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    if (Object.keys(body).length > 0) {
      const query = new URLSearchParams(body);
      const queryString = query.toString();
      path += '?' + queryString;
    }
    if (path.indexOf('//') === -1 && !keepPath) {
      path = this.apiUrl + path;
    }
    return this._ajax('DELETE', path, {}, headers);
  }

  public get<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    if (Object.keys(body).length > 0) {
      const query = new URLSearchParams(body);
      const queryString = query.toString();
      path += '?' + queryString;
    }
    if (path.indexOf('//') === -1 && !keepPath) {
      path = this.apiUrl + path;
    }
    return this._ajax('GET', path, {}, headers);
  }

  public post<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    if (path.indexOf('//') === -1 && !keepPath) {
      path = this.apiUrl + path;
    }
    return this._ajax('POST', path, body, headers);
  }

  private _ajax<T>(
    method: string,
    path: string,
    body: object,
    headers: object,
  ): Observable<T | undefined> {
    return ajax({
      url: path,
      method: method,
      body: body,
      headers: { ...this._defaultHeaders(), ...headers },
    }).pipe(map((result) => result.response as T | undefined));
  }

  private __ajax<T>(
    method: string,
    path: string,
    body: object,
    headers: object,
  ): Observable<T | undefined> {
    return ajax({
      url: path,
      method: method,
      body: body,
      headers: { ...this._defaultHeaders(), ...headers },
    }).pipe(map((result) => result.response as T | undefined));
  }

  private _defaultHeaders(): object {
    let headers = {
      accept: 'application/json',
    };

    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }
}

export const httpService = new HttpService();
