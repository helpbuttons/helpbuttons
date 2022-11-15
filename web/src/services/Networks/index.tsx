import { Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { INetwork } from "./network.type";
import { GlobalState, store } from "pages/index";
import { WatchEvent } from "store/Event";
import { map, tap, take, catchError } from "rxjs/operators";
import { localStorageService } from "services/LocalStorage";
import { httpService } from "services/HttpService";
import { UtilsService } from "services/Utils";
import { UpdateEvent } from "store/Event";
import { produce } from "immer";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class NetworkService {

  public static create(network, token: string, successFunc, failFunc) {
    store.emit(new CreateNetworkEvent(network, token,successFunc, failFunc));
  }

  public static new(data: INetwork, token: string): Observable<any> {
    let bodyData = {
      name: data.name,
      url: data.url,
      avatar: data.avatar,
      description: data.description,
      privacy: data.privacy,
      place: data.place,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: [],
      radius: data.radius,
    };

    const formData = UtilsService.objectToFormData(bodyData);

    return ajax({
      url: baseUrl + "/networks/new",
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
  }

  //Edit network
  public static edit(data: INetwork, user: IUser): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const networkWithHeaders$ = ajax({
      url: baseUrl + "/networks/edit/" + id,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        name: data.name,
        id: data.id,
        url: data.url,
        avatar: data.avatar,
        description: data.description,
        privacy: data.privacy,
        place: data.place,
        latitude: data.latitude,
        longitude: data.longitude,
        radius: data.radius,
        tags: data.tags,
        owner: user.id,
        friendNetworks: data.friendNetworks,
      },
    });

    return networkWithHeaders$;
  }

  //Get networks
  public static find(name): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const networkWithHeaders$ = ajax({
      url: baseUrl + "/networks/find/" + name,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });

    return networkWithHeaders$;
  }

  //Map networks
  public static map(data: INetwork): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const networkWithHeaders$ = ajax({
      url: baseUrl + "/networks/map",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        id: id,
      },
    });

    return networkWithHeaders$;
  }

  //Get network by id
  public static findById(id: string = ""): Observable<INetwork | undefined> {
    return httpService.get<INetwork>("/networks/findById/" + id);

    // //save the ajax object that can be .pipe by the observable
    // const networkWithHeaders$ = ajax({
    //   url: baseUrl + "/networks/findById/" + id,
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     accept: "application/json",
    //   },
    //   body: {
    //     id: id,
    //   },
    // });
    //
    // return networkWithHeaders$;
  }

  //Delete network
  public static _delete(id: any): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const networkWithHeaders$ = ajax({
      url: baseUrl + "/networks/delete/" + id,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        id: id,
      },
    });

    return networkWithHeaders$;
  }

  //Delete all networks
  public static deleteAll(id: any): Observable<any> {
    //save the ajax object that can be .pipe by the observable
    const networkWithHeaders$ = ajax({
      url: baseUrl + "/networks",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: {
        id: id,
      },
    });

    return networkWithHeaders$;
  }

  public static getNetworks(name: string) {
    const path = "/networks/find/" + name;
    return ajax(baseUrl + path).pipe(map((res: any) => res.response));
  }

}
