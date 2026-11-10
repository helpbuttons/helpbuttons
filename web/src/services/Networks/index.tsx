import { Observable, map } from "rxjs";
import { httpService, HttpService } from "services/HttpService";

import getConfig from "next/config";
import { Network } from "shared/entities/network.entity";
import { CreateNetworkDto, UpdateNetworkDto } from "shared/dtos/network.dto";
import { SetupDtoOut } from "shared/entities/setup.entity";
export class NetworkService {

  public static new(data: CreateNetworkDto): Observable<any> {
    // Use toFormData to handle logo and jumbo images
    const formData = HttpService.toFormData(data, ['logo', 'jumbo']);
    return httpService.post("networks/new", formData);
  }
  // //Get network by id
  public static findById(id: string = ""): Observable<Network | undefined> {
    return httpService.get<Network>("networks/findById")
    // return httpService.get<Network>("networks/findById" + id)
  }

  public static get(): Observable<SetupDtoOut | undefined> {
    return httpService.get<SetupDtoOut>("networks/config");
  }

  public static update(data: UpdateNetworkDto): Observable<any>{
    // Use toFormData to handle logo and jumbo images
    const formData = HttpService.toFormData(data, ['logo', 'jumbo']);
    return httpService.post("networks/update", formData)
  }

  public static activity(locale): Observable<any>{
    return httpService.get("activity/network?lang="+locale)
  }

  public static configuration() : Observable<any>{
    return httpService.get<Network>("networks/configuration")
  }
}
