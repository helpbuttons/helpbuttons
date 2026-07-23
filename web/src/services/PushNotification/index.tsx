import { Observable } from "rxjs";
import { httpService } from "services/HttpService";
import { SubscribeDto } from "shared/dtos/push-notification.dto";

export class PushNotificationService {

  public static subscribe(
    subscribeData : SubscribeDto
  ): Observable<any> {
    return httpService.post("push/subscribe", subscribeData);
  }

  public static unsubscribe(): Observable<any> {
    return httpService.delete("push/unsubscribe");
  }
  
}
