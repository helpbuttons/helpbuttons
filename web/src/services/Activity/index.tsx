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
  
  public static messagesMarkAllAsRead(): Observable<Activity[]> {
    return httpService.post<any>("activity/messages/markAllAsRead");
  }
  public static messagesUnread(): Observable<ActivityMessageDto[]> {
    return httpService.get<any>("activity/messages/unread");
  }
  public static messagesRead(page): Observable<ActivityMessageDto[]> {
    return httpService.get<any>(`activity/messages/read/${page ? page : 0}`);
  }

  public static notificationsRead(page): Observable<ActivityDtoOut[]> {
    return httpService.get<any>(`activity/notifications/${page}`);
  }
}
