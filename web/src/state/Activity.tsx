import produce from 'immer';
import { GlobalState, store } from 'pages';
import { catchError, forkJoin, map, zip } from 'rxjs';
import { ActivityService } from 'services/Activity';
import {
  Activity,
  ActivityDtoOut,
} from 'shared/entities/activity.entity';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { of } from 'rxjs';
import { useGlobalStore, useStore } from 'store/Store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInterval } from 'shared/custom.hooks';
import {
  LocalStorageVars,
  localStorageService,
} from 'services/LocalStorage';
import { ActivityMessageDto } from 'shared/dtos/activity.dto';
import _ from 'lodash';
export interface Activities {
  messages: Messages;
  notifications: ActivityDtoOut[];
  notificationsPage: number;
  notificationsPermissionGranted: boolean;
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

export class FindNewMessages implements WatchEvent {
  public constructor() {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    return ActivityService.messagesUnread().pipe(
      map((messages: ActivityDtoOut[]) => {
        store.emit(new FoundMessagesUnread(messages));
      }),
    );
  }
}

export class FoundMessagesUnread implements UpdateEvent {
  public constructor(private newMessages: ActivityMessageDto[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      const newNotifications = _.difference(this.newMessages, state.activities.messages.unread)
      newNotifications.forEach((notification) => 
      {
        store.emit(new QueueNewNotification())
      })
      newState.activities.messages.unread = this.newMessages.map((message) => {return {...message, notified: true}});
      
    });
  }
}

export class QueueNewNotification implements UpdateEvent{
  public constructor(private notification: PushNotification) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
        newState.newNotification = this.notification;
    });
  }
}

export class FindMoreReadMessages implements WatchEvent {
  public constructor(private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    const page = state.activities.messages.readPage;
    return ActivityService.messagesRead(page).pipe(
      map((messages: ActivityMessageDto[]) => {
        this.onSuccess(messages);
        store.emit(new FoundMessagesRead(messages));
      }),
    );
  }
}

export class FoundMessagesRead implements UpdateEvent {
  public constructor(private messages: ActivityMessageDto[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
        newState.activities.messages.read = _.uniqBy([
          ...state.activities.messages.read,
          ...this.messages,
        ], 'id');

        if(this.messages.length > 0)
        {
          newState.activities.messages.readPage =
          state.activities.messages.readPage + 1;
        }
        if(this.messages.length < 0){
          newState.activities.messages.readLoaded = true;
        }
        
        
    });
  }
}

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
export class ActivityMessagesMarkAllAsRead
  implements WatchEvent, UpdateEvent
{
  public constructor() {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities.messages.read = [
        ...state.activities.messages.unread.map((message) => {
          return { ...message, unread: false };
        }),
        ...state.activities.messages.read,
      ];
    });
  }
  public watch(state: GlobalState) {
    return ActivityService.messagesMarkAllAsRead();
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

export class FindMoreNotifications implements WatchEvent {
  public constructor(private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.sessionUser) {
      return of(undefined);
    }
    const page = state.activities.notificationsPage;
    return ActivityService.notificationsRead(page).pipe(
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
  console.log(activity);
  switch (activity.eventName) {
    case '':
      return { type: 'this', message: 'oloooow' };
  }
  return { type: activity.eventName, message: 'tralalla' };
};

export const useActivities = () => {
  const messages = useGlobalStore(
    (state: GlobalState) => state.activities.messages,
  );
  const notifications = useGlobalStore(
    (state: GlobalState) => state.activities.notifications,
  );

  return { messages, notifications };
};

export const usePoolFindNewActivities = ({sessionUser, messagesUnread, timeMs }) => {
  useEffect(() => {
    if (messagesUnread) {
      messagesUnread.forEach((message) => {
        // store.emit(new ActivityNotified(message.id));
        // if(!message.notified)
        // {
        //   alertService.info(message.message);
        // }
      });
    }
  }, [messagesUnread]);

  const increment = useCallback(() => {
    store.emit(new FindNewMessages());
  }, []);
  useInterval(increment, timeMs, { paused: !sessionUser });
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
