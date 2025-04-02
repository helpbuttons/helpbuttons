import { Observable, of } from 'rxjs';
import { httpService } from 'services/HttpService';
import { roundCoord } from 'shared/honeycomb.utils';
// const opencage = require('opencage-api-client');
export class GeoService {
  public static find(address: string, lat: string, lon: string, limited: boolean = false): Observable<any> {
    const url = `geo/search/${limited ? 'limited' : 'full' }/${lat}/${lon}/${address}`
    return httpService.get<any>(url)
  }

  public static reverse(lat: number, lng: number, limited: boolean): Observable<any> {
    const url = `geo/reverse/${limited ? 'limited' : 'full'}/${roundCoord(lat)}/${roundCoord(lng)}`
    return httpService.get<any>(url)
  }
  
}


