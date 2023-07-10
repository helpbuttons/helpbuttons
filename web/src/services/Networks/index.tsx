import { Observable, map } from "rxjs";
import { httpService } from "services/HttpService";

import getConfig from "next/config";
import { Network } from "shared/entities/network.entity";
import { CreateNetworkDto, UpdateNetworkDto } from "shared/dtos/network.dto";
import { SetupDtoOut } from "shared/entities/setup.entity";
export class NetworkService {

  public static hydrateNetwork(network) {
    return {
          ...network, 
          exploreSettings: JSON.parse(network.exploreSettings),
          buttonCount: network.buttonTypesCount.reduce((totalCount, buttonType) => totalCount + parseInt(buttonType.count), 0)
        }
  }
  public static new(data: CreateNetworkDto): Observable<any> {

    return httpService.post("networks/new", data);
  }
  // //Get network by id
  public static findById(id: string = ""): Observable<Network | undefined> {
    return httpService.get<Network>("networks/findById/" + id)
    .pipe(map((result) => this.hydrateNetwork(result)));
  }

  public static get(): Observable<SetupDtoOut | undefined> {
    return httpService.get<SetupDtoOut>("networks/config");
  }

  public static update(data: UpdateNetworkDto): Observable<any>{
    return httpService.post("networks/update", data)
  }
}
