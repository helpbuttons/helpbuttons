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

}
