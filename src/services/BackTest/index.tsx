import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { OpenApi } from './types';


export class BackTestService {

  public static getApi(): Observable<OpenApi> {
    return ajax.getJSON<OpenApi>('http://localhost:3001/openapi.json');
  }


  public static getAll(id: string): Observable<OpenApi> {
    return ajax.getJSON<OpenApi>('http://localhost:3001/openapi.json');
  }

  get(id: string) {
    return http.get(`/buttons/${id}`);
  }


}
