import produce from 'immer';
import { GlobalState, store } from 'state';
import { map } from 'rxjs';
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
import { Activities as AllActivities}  from 'shared/dtos/activity.dto';

import _ from 'lodash';

import { ButtonEntry } from 'shared/dtos/button.dto';
import { GroupMessageDtoOut } from 'shared/dtos/group-message.dto';

export interface Activities {
  buttons: ActivityDtoOut[];
  activitiesPage: number;
  notificationsPermissionGranted: boolean;
  focusMessageId: string;
  focusPostId: string;
  draftButton: ButtonEntry;
  community: GroupMessageDtoOut;
  admin: GroupMessageDtoOut; 
}

export const activitiesInitialState: Activities = {
  //@ts-ignore
  buttons: [],
  activitiesPage: 0,
  notificationsPermissionGranted: false,
  focusMessageId: null,
  focusPostId: null,
  draftButton: null,
  community: null,
  admin: null,
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
    store.emit(new FindLatestActivities())
  }, []);
  useInterval(increment, timeMs, { paused: !sessionUser });
};

export class FindLatestActivities implements WatchEvent {
  public constructor(private onSuccess = (loadedActivities) => { }) { }

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    return ActivityService.activities(0).pipe(
      map((activities: AllActivities) => {
        this.onSuccess(activities.buttons);
        store.emit(new FoundLatestActivities(activities));
      }),
    );
  }
}

export class FoundLatestActivities implements UpdateEvent {
  public constructor(private activities: AllActivities) { }

  public update(state: GlobalState) {
    return produce(state, (newState) => {

      // in here we merge the current activities on the state, with the new activity on ddbb
      newState.activities.buttons = uniqActivities(this.activities.buttons, state.activities.buttons)
      newState.activities.activitiesPage = 1
      newState.activities.community = this.activities.community
      newState.activities.admin = this.activities.admin
    });
  }
}

function uniqActivities(arr1, arr2)
{
  return _.uniqWith([
    ...arr1,
    ...arr2,
  ],  (a,b) => {return a?.buttonId == b?.buttonId && a?.consumerId == b?.consumerId})
}

export function uniqById(arr1, arr2)
{
  if(!arr1)
    return arr2;
  return _.uniqWith([
    ...arr1,
    ...arr2,
  ],  (a,b) => {return a.id == b.id})
}


export class FindMoreActivities implements WatchEvent {
  public constructor(private onSuccess = (loadedActivities) => { }) { }

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    const page = state.activities.activitiesPage;
    return ActivityService.activities(page).pipe(
      map((activities: AllActivities) => {
        this.onSuccess(activities.buttons);
        store.emit(new FoundActivities(activities));
      }),
    );
  }
}

export class FoundActivities implements UpdateEvent {
  public constructor(private activities: AllActivities) { }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.buttons = uniqActivities(state.activities.buttons, this.activities.buttons)
      newState.activities.community = this.activities.community
      newState.activities.admin = this.activities.admin
      if (this.activities.buttons.length > 0) {
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
      map((_activities: ActivityDtoOut[]) => {
        store.emit(new FindLatestActivities())
        this.onSuccess(_activities)
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
    return ActivityService.sendMessage(this.message, this.buttonId, this.consumerId).pipe(map((activityId) => {this.onSuccess(activityId)} ))
  }
}

export class SetFocusOnMessage
  implements UpdateEvent
{
  public constructor(private messageId) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.focusMessageId = this.messageId
      newState.activities.focusPostId = null
    });
  }
}

export class SetFocusOnPost implements UpdateEvent
{
  public constructor(private postId) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.focusPostId = this.postId
      newState.activities.focusMessageId = null
    });
  }
}

export class ActivityMarkAsRead implements WatchEvent, UpdateEvent {
  public constructor(private activityId: string) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.buttons = state.activities.buttons.map((activity) => {
        if(activity.id == this.activityId){
          return {...activity,read: true}
        }
        return activity
      })
    });
  }
  public watch(state: GlobalState) {
    return ActivityService.markAsRead(this.activityId)
  }
}

export class SetDraftButton implements UpdateEvent{
  public constructor(private button) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.draftButton = this.button
    })
  }
}

export class SendNewGroupMessage implements WatchEvent{
  public constructor(private groupType, private message, private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    return ActivityService.sendGroupMessage(this.groupType, this.message).pipe(map(() => {this.onSuccess()} ))
  }
}


export class FindGroupMessages implements WatchEvent {
  public constructor(private groupType, private page, private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    
    return ActivityService.groupMessages(this.groupType, this.page).pipe(
      map((messages) => {
        store.emit(new FindLatestActivities())
        this.onSuccess(messages)
      }),
    );
  }
}