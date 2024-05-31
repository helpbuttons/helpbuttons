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
    return httpService.post("buttons/new?networkId=" + networkId, data);
  }

  public static update(buttonId: string, data: UpdateButtonDto): Observable<any> {
    return httpService.post("buttons/update/" + buttonId, data);
  }

  public static findJson(optionsJson: string): Observable<Button[]> {
    const options = JSON.parse(optionsJson)
    if(!options.hexagons)
    {
      console.error('no hexagons defined...')
      return of([]);
    }
    if(!options.resolution)
    {
      console.error('resolution not defined...')
      return of([]);
    }
    return this.find(options.resolution, options.hexagons)
  }

  public static find(resolution :number,hexagons: string[]): Observable<Button[]> {
    if (hexagons.length < 1)
    {
      console.error('empty hexagons...')
      return of([]);
    }
    return httpService.post<Button[]>(`buttons/findh3/${resolution}`,{hexagons});
  }

  public static findById(id: string): Observable<any> {
    return httpService.get<Button>("buttons/findById/" + id)
  }

  public static delete(id: any): Observable<any> {
    return httpService.delete<any>("buttons/delete/"+id);
  }

  public static follow(id: any): Observable<any> {
    return httpService.get<any>(`buttons/follow/${id}`);
  }

  public static unfollow(id: any): Observable<any> {
    return httpService.get<any>(`buttons/unfollow/${id}`);
  }

  public static getPhone(id: any): Observable<any> {
    return httpService.get<any>(`buttons/getphone/${id}`);
  }

  public static renew(id: any): Observable<any> {
    return httpService.get<any>(`buttons/renew/${id}`);
  }
}
