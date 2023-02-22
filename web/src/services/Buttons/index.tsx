import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";

import { httpService } from "services/HttpService";
import getConfig from "next/config";
import { UtilsService } from "services/Utils";
import { Button } from "shared/entities/button.entity";
import { UpdateButtonDto } from "shared/dtos/button.dto";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class ButtonService {

  public static new(
    data: Button,
    networkId: string
  ): Observable<any> {
    return httpService.post("/buttons/new?networkId=" + networkId, data);
  }

  public static update(buttonId: string, data: UpdateButtonDto): Observable<any> {
    return httpService.post("/buttons/update/" + buttonId, data);
  }

  public static find(networkId: string, bounds: any): Observable<Button[]> {
    if (!bounds || !bounds._northEast)
    {
      console.error('wrong bounds? ')
      return of([]);
    }
    return httpService.get<Button[]>("/buttons/find/" + networkId, 
    {
      northEast_lat: bounds._northEast.lat.toString(),
      northEast_lng: bounds._northEast.lng.toString(),
      southWest_lat: bounds._southWest.lat.toString(),
      southWest_lng: bounds._southWest.lng.toString(),
    });
  }

  public static findById(id: string): Observable<any> {
    return httpService.get<Button>("/buttons/findById/" + id)
  }

  public static delete(id: any): Observable<any> {
    return httpService.delete<any>("buttons/delete/"+id);
  }
}
