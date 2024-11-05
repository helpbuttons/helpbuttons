import { Observable, of } from 'rxjs';
import { httpService } from 'services/HttpService';
import { roundCoord } from 'shared/honeycomb.utils';
// const opencage = require('opencage-api-client');
export class GeoService {
  public static find(address: string): Observable<any> {
    return httpService.get<any>(`geo/search/${address}`)
  }

  public static reverse(lat: number, lng: number): Observable<any> {
    return httpService.get<any>(`geo/reverse/${roundCoord(lat)}/${roundCoord(lng)}`)
  }
  
}
