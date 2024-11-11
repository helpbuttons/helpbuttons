import { Observable, of } from 'rxjs';
import { httpService } from 'services/HttpService';
import { roundCoord } from 'shared/honeycomb.utils';
// const opencage = require('opencage-api-client');
export class GeoService {
  public static find(address: string): Observable<any> {
    const url = `geo/search/${address}`
    return httpService.get<any>(url)
  }

  public static reverse(lat: number, lng: number): Observable<any> {
    const url = `geo/reverse/${roundCoord(lat)}/${roundCoord(lng)}`
    return httpService.get<any>(url)
  }
  
}


