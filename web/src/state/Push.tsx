import { map, of } from "rxjs";
import { PushNotificationService } from "services/PushNotification";
import { GlobalState } from "state";
import { WatchEvent } from "store/Event";

export class PushSubscribe implements WatchEvent {
    public constructor(private subscribeData) { }
  
    public watch(state: GlobalState) {
      if (!state.sessionUser) {
        return of(undefined);
      }
      return PushNotificationService.subscribe(this.subscribeData).pipe(
        map((ans) => {
          console.log(ans)

        }),
      );
    }
  }

  export class PushUnsubscribe implements WatchEvent {
    public constructor() { }
  
    public watch(state: GlobalState) {
      if (!state.sessionUser) {
        return of(undefined);
      }
      return PushNotificationService.unsubscribe().pipe(
        map((ans) => {
          console.log(ans)
          
        }),
      );
    }
  }