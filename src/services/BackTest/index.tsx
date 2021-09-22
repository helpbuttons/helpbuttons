import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { OpenApi } from './types';


export class BackTestService {

  public static getApi(): Observable<OpenApi> {
    return ajax.getJSON<OpenApi>('http://localhost:3001/openapi.json');
  }

}
