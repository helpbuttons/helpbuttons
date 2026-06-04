import { Observable, of } from 'rxjs';
import { httpService } from 'services/HttpService';
import { CreateKeyLocationDto } from 'shared/dtos/keylocation.dto';
import { roundCoord } from 'shared/honeycomb.utils';
// const opencage = require('opencage-api-client');
export class GeoService {
  public static find(address: string, lat: string, lon: string, limited: boolean = false): Observable<any> {
    const url = `geo/search/${limited ? 'limited' : 'full' }/${lat ? lat : 0 }/${lon ? lon : 0 }/${address}`
    return httpService.get<any>(url)
  }

  public static reverse(lat: number, lng: number, limited: boolean): Observable<any> {
    const url = `geo/reverse/${limited ? 'limited' : 'full'}/${roundCoord(lat)}/${roundCoord(lng)}`
    return httpService.get<any>(url)
  }
  
}

export class KeyLocationService {
  public static list(): Observable<any> {
    return httpService.get<any>(`geo/keylocation/list`)
  }

  public static new(
    data: CreateKeyLocationDto
  ): Observable<any> {
    return httpService.post(`geo/keylocation/new`, data);
  }
  public static delete(id: string): Observable<any> {
    return httpService.get<any>(`geo/keylocation/delete/${id}`)
  }

}



