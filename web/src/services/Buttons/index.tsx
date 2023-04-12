import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";

import { httpService } from "services/HttpService";
import getConfig from "next/config";
import { UtilsService } from "services/Utils";
import { Button } from "shared/entities/button.entity";
import { UpdateButtonDto } from "shared/dtos/button.dto";
import { Bounds } from "pigeon-maps";
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

  public static findJson(optionsJson: string): Observable<Button[]> {
    const options = JSON.parse(optionsJson)
     if (!options.networkId || options.networkId.length < 2) {
      return of([]);
    }
    return this.find(options.networkId, options.bounds)
  }

  public static find(networkId: string, bounds: Bounds): Observable<Button[]> {
    if (!bounds || !bounds.ne)
    {
      console.error('wrong bounds? ')
      return of([]);
    }
    return httpService.get<Button[]>("/buttons/find/" + networkId, 
    {
      northEast_lat: bounds.ne[0].toString(),
      northEast_lng: bounds.ne[1].toString(),
      southWest_lat: bounds.sw[0].toString(),
      southWest_lng: bounds.sw[1].toString(),
    });
  }

  public static findById(id: string): Observable<any> {
    return httpService.get<Button>("/buttons/findById/" + id)
  }

  public static delete(id: any): Observable<any> {
    return httpService.delete<any>("buttons/delete/"+id);
  }
}
