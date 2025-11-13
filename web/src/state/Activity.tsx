import produce from 'immer';
import { GlobalState, store } from 'state';
import {  map } from 'rxjs';
import { ActivityService } from 'services/Activity';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { of } from 'rxjs';
import { useCallback } from 'react';
import { useInterval } from 'shared/custom.hooks';
import {
  LocalStorageVars,
  localStorageService,
} from 'services/LocalStorage';
import { ActivityDtoOut } from 'shared/dtos/activity.dto';
import _ from 'lodash';

export interface Activities{
  activities: ActivityDtoOut[];
  activitiesPage: number;
  notificationsPermissionGranted: boolean;
  focusMessageId: number;
}

export const activitiesInitialState: Activities = {
  //@ts-ignore
  activities: [],
  activitiesPage: 0,
  notificationsPermissionGranted: false,
  focusMessageId: null,
};

export class PermissionGranted implements UpdateEvent {
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      localStorageService.save(
        LocalStorageVars.HAS_PERMISSION_NOTIFICATIONS,
        true,
      );
      newState.activities.notificationsPermissionGranted = true;
    });
  }
}
export class PermissionRevoke implements UpdateEvent {
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      localStorageService.remove(
        LocalStorageVars.HAS_PERMISSION_NOTIFICATIONS,
      );
      newState.activities.notificationsPermissionGranted = false;
    });
  }
}


export const usePoolFindNewActivities = ({sessionUser, timeMs }) => {
  const increment = useCallback(() => {
    // store.emit(new FindNewMessages()); // TODO
    console.log('TODO request new messages unread...')
  }, []);
  useInterval(increment, timeMs, { paused: !sessionUser });
};

export const useActivities = () => {
  console.log('TODO remove me')

  return { messages: [], notifications: [] };
};


export class FindMoreActivities implements WatchEvent {
  public constructor(private onSuccess = (loadedActivities) => {}) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    const page = state.activities.activitiesPage;
    return ActivityService.activities(page).pipe(
      map((activities: ActivityDtoOut[]) => {
        this.onSuccess(activities);
        store.emit(new FoundActivities(activities));
      }),
    );
  }
}

export class FoundActivities implements UpdateEvent {
  public constructor(private activities: ActivityDtoOut[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      
        newState.activities.activities = _.uniqBy([
          ...state.activities.activities,
          ...this.activities,
        ], 'id');
        if(this.activities.length > 0)
        {
          newState.activities.activitiesPage =
          state.activities.activitiesPage + 1;
        }
        
    });
  }
}

export class FindActivityDetails implements WatchEvent {
  public constructor(private buttonId, private consumerId, private page, private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    return ActivityService.activitiesButton(this.buttonId, this.consumerId, this.page).pipe(
      map((activities: ActivityDtoOut[]) => {
        this.onSuccess(activities)
      }),
    );
  }
}

export class SendNewMessage implements WatchEvent{
  public constructor(private message, private buttonId, private consumerId, private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    return ActivityService.sendMessage(this.message, this.buttonId, this.consumerId).pipe(map(() => this.onSuccess() ))
  }
}
