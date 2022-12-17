import { Observable } from "rxjs";
import { httpService } from "services/HttpService";

import getConfig from "next/config";
import { Network } from "shared/entities/network.entity";
export class NetworkService {

  public static new(data: any): Observable<any> {

    return httpService.post("/networks/new", data);
  }
  // //Get network by id
  public static findById(id: string = ""): Observable<Network | undefined> {
    return httpService.get<Network>("/networks/findById/" + id);
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



  // public static getNetworks(name: string) {
  //   const path = "/networks/find/" + name;
  //   return ajax(baseUrl + path).pipe(map((res: any) => res.response));
  // }

}
