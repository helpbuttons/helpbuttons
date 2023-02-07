import { Observable } from "rxjs";
import { httpService } from "services/HttpService";

import getConfig from "next/config";
import { Network } from "shared/entities/network.entity";
import { CreateNetworkDto } from "shared/dtos/network.dto";
export class NetworkService {

  public static new(data: CreateNetworkDto): Observable<any> {

    return httpService.post("/networks/new", data);
  }
  // //Get network by id
  public static findById(id: string = ""): Observable<Network | undefined> {
    return httpService.get<Network>("/networks/findById/" + id);
  }

}
