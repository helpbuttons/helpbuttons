import produce from 'immer';
import { GlobalState, store } from 'state';
import { catchError, forkJoin, map, zip } from 'rxjs';
import { ActivityService } from 'services/Activity';
import {
  Activity,
} from 'shared/entities/activity.entity';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { of } from 'rxjs';
import { useGlobalStore } from 'state';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInterval } from 'shared/custom.hooks';
import {
  LocalStorageVars,
  localStorageService,
} from 'services/LocalStorage';
import { ActivityDtoOut, ActivityMessageDto } from 'shared/dtos/activity.dto';
import _ from 'lodash';
import dconsole from 'shared/debugger';

export interface Activities{
  activities: ActivityDtoOut[];
  activitiesPage: number;
  notificationsPermissionGranted: boolean;
}

export const activitiesInitialState: Activities = {
  //@ts-ignore
  activities: [],
  activitiesPage: 0,
  notificationsPermissionGranted: false,
  // focusMessageId: -1,
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
  public constructor() {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    const page = state.activities.activitiesPage;
    return ActivityService.activities(page).pipe(
      map((notifications: ActivityDtoOut[]) => {
        store.emit(new FoundNotifications(notifications));
      }),
    );
  }
}

export class FoundNotifications implements UpdateEvent {
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


/*export interface Activities {
  messages: Messages;
  notifications: ActivityDtoOut[];
  notificationsPage: number;
  notificationsPermissionGranted: boolean;
  focusMessageId: number;
}
export interface Messages {
  read: ActivityMessageDto[];
  readPage: number;
  unread: ActivityUnreadMessage[];
  readLoaded: boolean
}

export interface ActivityUnreadMessage extends ActivityMessageDto {
  notified: boolean;
}

export const activitiesInitialState: Activities = {
  //@ts-ignore
  messages: { read: [], unread: [], readPage: 0, notified: false, readLoaded: false },
  notifications: [],
  notificationsPage: 0,
  notificationsPermissionGranted: false,
  focusMessageId: -1,
};



export class ActivityMarkAsRead implements WatchEvent, UpdateEvent {
  public constructor(private messageId: string, private onSucess) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.messages.unread =
        state.activities.messages.unread.filter(
          (message: ActivityMessageDto) =>
            message.id != this.messageId,
        );

      const message = state.activities.messages.unread.find(
        (message: ActivityMessageDto) => message.id == this.messageId,
      );
      newState.activities.messages.read = [
        ...state.activities.messages.read,
        message,
      ];
    });
  }
  public watch(state: GlobalState) {
    return ActivityService.markAsRead(this.messageId).pipe(
      map(() => this.onSucess()),
    );
  }
}

export class ActivityNotificationsMarkAllAsRead
  implements WatchEvent, UpdateEvent
{
  public constructor() {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      // newState.activites.notifications = state.activites.notifications.map((activity) => { return {...activity, unread: false}});
    });
  }
  public watch(state: GlobalState) {
    // return ActivityService.markAllAsRead()
  }
}


export class SetFocusOnMessage
  implements UpdateEvent
{
  public constructor(private messageId) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.focusMessageId = this.messageId
    });
  }
}

export class FindMoreNotifications implements WatchEvent {
  public constructor(private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    const page = state.activities.notificationsPage;
    return ActivityService.notifications(page).pipe(
      map((notifications: ActivityDtoOut[]) => {
        this.onSuccess(notifications);
        store.emit(new FoundNotifications(notifications));
      }),
    );
  }
}

export class FoundNotifications implements UpdateEvent {
  public constructor(private notifications: ActivityDtoOut[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
        newState.activities.notifications = _.uniqBy([
          ...state.activities.notifications,
          ...this.notifications,
        ], 'id');
        newState.activities.focusMessageId = -1;
        if(this.notifications.length > 0)
        {
          newState.activities.notificationsPage =
          state.activities.notificationsPage + 1;
        }
        
    });
  }
}




export const unreadActivities = (activities) => {
  return activities.reduce((accumulator, activity) => {
    if (!activity.read) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);
};

export class ActivityNotified implements UpdateEvent {
  public constructor(private messageId: string) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      const message = state.activities.messages.unread.find(
        (message: ActivityMessageDto) => message.id == this.messageId,
      );
      newState.activities.messages.read = _.uniqBy([...state.activities.messages.read,{...message, notified: true}], 'id')
    });
  }
}

export const activityTo = (activity: Activity) => {
  dconsole.log(activity);
  switch (activity.eventName) {
    case '':
      return { type: 'this', message: 'oloooow' };
  }
  return { type: activity.eventName, message: 'tralalla' };
};




// export class SendMessageToAdmins implements WatchEvent {
//   public constructor(private onSuccess) {}

//   public watch(state: GlobalState) {
//     if(!state.sessionUser)
//     {
//       return of(undefined)
//     }
// state.networks.selectedNetwork.administrators.forEach((admin) =>
//   // Pos
// )
// return ActivityService.messagesUnread().pipe(
//   map((messages: ActivityDtoOut[]) => {
//     this.onSuccess()
//     store.emit(new FoundMessagesRead(messages))
//   })
// )
// }
// }
*/