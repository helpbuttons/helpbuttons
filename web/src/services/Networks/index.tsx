import { Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { GlobalState, store } from "pages/index";
import { WatchEvent } from "store/Event";
import { map, tap, take, catchError } from "rxjs/operators";
import { localStorageService } from "services/LocalStorage";
import { httpService } from "services/HttpService";
import { UtilsService } from "services/Utils";
import { UpdateEvent } from "store/Event";
import { produce } from "immer";

import getConfig from "next/config";
import { CreateNetworkDto } from "shared/dtos/network.dto";
import { Network } from "shared/entities/network.entity";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class NetworkService {

  public static new(data: any): Observable<any> {
    // let bodyData = {
    //   name: data.name,
    //   // url: data.url,
    //   logo: logo,
    //   jumbo: jumbo,
    //   description: data.description,
    //   latitude: data.latitude,
    //   longitude: data.longitude,
    //   tags: [],
    //   radius: data.radius,
    // };

    const formData = UtilsService.objectToFormData(data);
    return httpService.post("/networks/new", formData);
  }

  //Edit network
  // public static edit(data: Network, user: IUser): Observable<any> {
  //   //save the ajax object that can be .pipe by the observable
  //   const networkWithHeaders$ = ajax({
  //     url: baseUrl + "/networks/edit/" + id,
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //       accept: "application/json",
  //     },
  //     body: {
  //       name: data.name,
  //       id: data.id,
  //       url: data.url,
  //       avatar: data.avatar,
  //       description: data.description,
  //       privacy: data.privacy,
  //       place: data.place,
  //       latitude: data.latitude,
  //       longitude: data.longitude,
  //       radius: data.radius,
  //       tags: data.tags,
  //       owner: user.id,
  //       friendNetworks: data.friendNetworks,
  //     },
  //   });

  //   return networkWithHeaders$;
  // }

  // //Get networks
  // public static find(name): Observable<any> {
  //   //save the ajax object that can be .pipe by the observable
  //   const networkWithHeaders$ = ajax({
  //     url: baseUrl + "/networks/find/" + name,
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       accept: "application/json",
  //     },
  //   });

  //   return networkWithHeaders$;
  // }

  // //Map networks
  // public static map(data: INetwork): Observable<any> {
  //   //save the ajax object that can be .pipe by the observable
  //   const networkWithHeaders$ = ajax({
  //     url: baseUrl + "/networks/map",
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       accept: "application/json",
  //     },
  //     body: {
  //       id: id,
  //     },
  //   });

  //   return networkWithHeaders$;
  // }

  // //Get network by id
  public static findById(id: string = ""): Observable<Network | undefined> {
    return httpService.get<Network>("/networks/findById/" + id);
  }

  // public static getNetworks(name: string) {
  //   const path = "/networks/find/" + name;
  //   return ajax(baseUrl + path).pipe(map((res: any) => res.response));
  // }

}
