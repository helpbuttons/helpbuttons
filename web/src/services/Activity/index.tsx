import { Observable } from "rxjs";
import { httpService } from "services/HttpService";
import getConfig from "next/config";
import { Activity } from "shared/entities/activity.entity";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class ActivityService {


  public static find(): Observable<Activity[]> {
    return httpService.get<any>("/activity/find/");
  }
}
