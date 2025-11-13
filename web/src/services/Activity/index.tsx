import { Observable } from "rxjs";
import { httpService } from "services/HttpService";
import getConfig from "next/config";
import { Activity, ActivityDtoOut } from "shared/entities/activity.entity";
import { ActivityMessageDto } from "shared/dtos/activity.dto";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export class ActivityService {

  public static markAsRead(activityId): Observable<Activity[]> {
    return httpService.post<any>("activity/markAsRead/" + activityId);
  }

  public static activities(page): Observable<ActivityDtoOut[]> {
    return httpService.get<any>(`activity/activities/${page}`);
  }


  public static activitiesButton(buttonId, consumerId, page): Observable<ActivityDtoOut[]> {
    return httpService.get<any>(`activity/activities/button/${buttonId}/${consumerId}/${page}`);
  }
  public static sendMessage(message, buttonId, consumerId){
    return httpService.post<any>(`activity/sendMessage/${buttonId}/${consumerId}`, {message});
  }
}
