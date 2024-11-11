import { BehaviorSubject, Observable } from 'rxjs';


import {
  localStorageService,
  LocalStorageVars,
} from 'services/LocalStorage';
import getConfig from 'next/config';
import { rxjsHelper } from 'shared/helpers/rxjs.helper';

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
    const { publicRuntimeConfig } = getConfig();
    this.apiUrl = `${publicRuntimeConfig.apiUrl}/`;
  }
  public getAccessToken() {
    return localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
  }
  public setAccessToken(accessToken?: string) {
    console.log('setting up new token ' + accessToken)
    localStorageService.save(
      LocalStorageVars.ACCESS_TOKEN,
      accessToken.toString(),
    );
    this.isAuthenticated$.next(true);
  }

  public clearAccessToken() {
    console.log('cleaning access token');
    localStorageService.remove(LocalStorageVars.ACCESS_TOKEN);
    this.isAuthenticated$.next(false);
  }

  public delete<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    path = this.bodyToPath(path, body);
    path = this.correctApiPath(path, keepPath);
    headers = this.addTokenToHeaders(headers)
    return rxjsHelper.delete(path, headers);
  }

  public get<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    path = this.bodyToPath(path, body);
    path = this.correctApiPath(path, keepPath);
    headers = this.addTokenToHeaders(headers)
    return rxjsHelper.get(path, headers);
  }

  public post<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    path = this.correctApiPath(path, keepPath);
    headers = this.addTokenToHeaders(headers)
    return rxjsHelper.post(path, body, headers);
  }

  private addTokenToHeaders(headers): object {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return { ...headers, accept: 'application/json' };
  }
 
  private bodyToPath(path, body) {
    if (Object.keys(body).length > 0) {
      const query = new URLSearchParams(body);
      const queryString = query.toString();
      path += '?' + queryString;
    }
    return path;
  }

  private correctApiPath(path, keepPath) {
    if (path.indexOf('//') === -1 && !keepPath) {
      path = this.apiUrl + path;
    }
    return path;
  }
}

export const httpService = new HttpService();
