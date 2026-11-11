import { map, catchError } from 'rxjs/operators';
import { ajax, AjaxError } from 'rxjs/ajax';
import { Observable, throwError } from 'rxjs';

class RxjsHelper {
  public delete<T>(
    path: string,
    headers: object = {},
  ): Observable<T | undefined> {
    return this._ajax<T>('DELETE', path, {}, headers);
  }

  public get<T>(
    path: string,
    headers: object = {},
  ): Observable<T | undefined> {
    return this._ajax<T>('GET', path, {}, headers);
  }

  public post<T>(
    path: string,
    body: object = {},
    headers: object = {},
  ): Observable<T | undefined> {
    return this._ajax<T>('POST', path, body, headers);
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
      headers: headers,
    }).pipe(
      map((result) => result.response as T | undefined),
      catchError((error: AjaxError) => {
        console.error(`AJAX ${method} ${path} failed:`, error.status, error.message);
        return throwError(() => error);
      }),
    );
  }
}

export const rxjsHelper = new RxjsHelper();