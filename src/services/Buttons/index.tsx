import { Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { IButton } from "./button.type";

import { httpService } from "services/HttpService";
import getConfig from "next/config";
import { UtilsService } from "services/Utils";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class ButtonService {

  public static new(
    data: IButton,
    token: string,
    networkId: string
  ): Observable<any> {

    let bodyData = {
      name: data.name,
      type: data.type,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: data.tags,
      images: data.images,
    };

    const formData = UtilsService.objectToFormData(bodyData);

    return ajax({
      url: baseUrl + "/buttons/new?networkId=" + networkId,
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: formData
    });
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

  //Edit button
  public static addToNetworks(data: IButton): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const buttonWithHeaders$ = ajax({
      url: baseUrl + "/buttons/addToNetworks/" + id,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        name: data.id,
        networks: data.networks,
      },
    });

    return buttonWithHeaders$;
  }

  //Get buttons
  public static find(networkId: string): Observable<IButton[]> {
    return httpService.get<IButton[]>("/buttons/find/" + networkId);
    // //save the ajax object that can be .pipe by the observable
    // const buttonWithHeaders$ = ajax({
    //   url: baseUrl + "/buttons/find/"+networkId,
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     accept: "application/json",
    //   },
    //   body: {},
    // });
    //
    // return buttonWithHeaders$;
  }

  //Get button by id
  public static findById(id: string): Observable<any> {
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
