import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { IButton } from "./button.type";

import { httpService } from "services/HttpService";
import getConfig from "next/config";
import { UtilsService } from "services/Utils";
import { Bounds } from "leaflet";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class ButtonService {

  public static new(
    data: IButton,
    networkId: string
  ): Observable<any> {
    return httpService.post("/buttons/new?networkId=" + networkId, data);
  }

  //Edit button
  public static edit(data: IButton): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const buttonWithHeaders$ = ajax({
      url: baseUrl + "/buttons/edit/" + id,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        name: data.name,
        type: data.type,
        tags: data.tags,
        description: data.description,
        geoPlace: data.geoPlace,
        owner: data.owner,
        templateButtonId: data.templateButtonId,
      },
    });

    return buttonWithHeaders$;
  }

  //Get buttons
  public static find(networkId: string, bounds: any): Observable<IButton[]> {
    if (!bounds || !bounds._northEast)
    {
      console.error('wrong bounds? ')
      return of([]);
    }
    return httpService.get<IButton[]>("/buttons/find/" + networkId, 
    {
      northEast_lat: bounds._northEast.lat.toString(),
      northEast_lng: bounds._northEast.lng.toString(),
      southWest_lat: bounds._southWest.lat.toString(),
      southWest_lng: bounds._southWest.lng.toString(),
    });
  }

  //Get button by id
  public static findById(id: string): Observable<any> {
    return httpService.get<IButton>("/buttons/findById/" + id)
    //save the ajax object that can be .pipe by the observable
    const buttonWithHeaders$ = ajax({
      url: baseUrl + "/buttons/findById/" + id,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        id: id,
      },
    });

    return buttonWithHeaders$;
  }

  //Delete button
  public static _delete(id: any): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const buttonWithHeaders$ = ajax({
      url: baseUrl + "/buttons/delete/" + id,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        id: id,
      },
    });

    return buttonWithHeaders$;
  }

  //Delete all buttons
  public static deleteAll(id: any): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const buttonWithHeaders$ = ajax({
      url: baseUrl + "/buttons",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        id: id,
      },
    });

    return buttonWithHeaders$;
  }
}
