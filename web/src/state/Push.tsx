import produce from "immer";
import { map, of } from "rxjs";
import { PushNotificationService } from "services/PushNotification";
import { GlobalState, store } from "state";
import { UpdateEvent, WatchEvent } from "store/Event";

export class PushSubscribe implements WatchEvent {
    public constructor(private subscribeData) { }
  
    public watch(state: GlobalState) {
      if (!state.sessionUser) {
        return of(undefined);
      }
      return PushNotificationService.subscribe(this.subscribeData).pipe(
        map((ans) => {
          if(ans?.affected){
            store.emit(new UpdateSubscribe(true))
          }
        }),
      );
    }
  }

  export class UpdateSubscribe implements UpdateEvent{
    public constructor(private newValue) {}
    public update(state: GlobalState) {
      return produce(state, (newState) => {
        newState.sessionUser.pushSubscribed = this.newValue
      });
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
          if(ans?.affected){
            store.emit(new UpdateSubscribe(false))
          }
        }),
      );
    }
  }