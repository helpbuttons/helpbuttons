import produce from 'immer';
import { GlobalState, store } from 'pages';
import { catchError, forkJoin, map, zip } from 'rxjs';
import { ActivityService } from 'services/Activity';
import {
  Activity,
  ActivityDtoOut,
} from 'shared/entities/activity.entity';
import { ActivityEventName } from 'shared/types/activity.list';
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
import { MessageDto } from 'shared/dtos/post.dto';
import { alertService } from 'services/Alert';
import { stat } from 'fs';
import _ from 'lodash';
export interface Activities {
  messages: Messages;
  notifications: Notifications;
  notificationsPermissionGranted: boolean;
}
export interface Messages {
  read: ActivityMessageDto[];
  readPage: number;
  unread: ActivityUnreadMessage[];
}

export interface ActivityUnreadMessage extends ActivityMessageDto {
  notified: boolean;
}
export interface Notifications {
  read: ActivityDtoOut[];
  unread: ActivityDtoOut[];
}
export const activitiesInitialState: Activities = {
  //@ts-ignore
  messages: { read: [], unread: [], readPage: 0, notified: false },
  notifications: { read: [], unread: [] },
  notificationsPermissionGranted: false,
};

export class PermissionGranted implements UpdateEvent {
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      localStorageService.save(
        LocalStorageVars.HAS_PERMISSION_NOTIFICATIONS,
        true,
      );
      newState.activites.notificationsPermissionGranted = true;
    });
  }
}
export class PermissionRevoke implements UpdateEvent {
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      localStorageService.remove(
        LocalStorageVars.HAS_PERMISSION_NOTIFICATIONS,
      );
      newState.activites.notificationsPermissionGranted = false;
    });
  }
}

export class FindNewMessages implements WatchEvent {
  public constructor() {}

  public watch(state: GlobalState) {
    if (!state.loggedInUser) {
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
      let _newMessages: ActivityUnreadMessage[];
      _newMessages = this.newMessages.map((_msg) => {
        const notified = state.activites.messages.unread.find(
                  (_mssg) => _mssg.id != _msg.id,
                )?.notified;
          // console.log(notified)
        return {..._msg, notified: false}
      })
      //  = this.newMessages;
      // if (state.activites.messages?.unread?.length > 0) {
      //   const _znewMessages = this.newMessages.filter((_msg) =>).map((_message) => {
      //     return {
      //       ..._message,
      //       notified: state.activites.messages.unread.find(
      //         (_msg) => _msg.id != _message.id,
      //       )?.notified,
      //     };
      //   });
      //   console.log(this.newMessages)
      //   console.log(_znewMessages)
      // }

      newState.activites.messages.unread = _newMessages;
      // newState.activites.messages.unread = _.uniqBy([..._newMessages, ...state.activites.messages.unread], 'id')
      // const message = state.activites.messages.unread.find(
      //   (message: ActivityMessageDto) => message.id == this.messageId,
      // );
      // const _newMessages = this.newMessages.map((_message) => {
      //   return {
      //     ..._message,
      //     notified: false
      //   }
      // })
      // newState.activites.messages.read = [
      //   ...state.activites.messages.read,
      //   message,
      // ];
      // if (
      //   !(
      //     JSON.stringify(state.activites.messages.unread) ==
      //     JSON.stringify(this.newMessages)
      //   )
      // ) {
      // newState.activites.messages.unread = this.newMessages
      //   .filter(
      //     (message) =>
      //       !state.activites.messages.unread.find(
      //         (_message) => message.id == _message.id,
      //       ),
      //   )
      //   .map((message) => {
      //     return { ...{ notified: false }, ...message };
      //   });
      // }
    });
  }
}

export class FindMoreReadMessages implements WatchEvent {
  public constructor(private onSuccess) {}

  public watch(state: GlobalState) {
    if (!state.loggedInUser) {
      return of(undefined);
    }
    const page = state.activites.messages.readPage;
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
      //   newState.activites.messages.read = [
      //     ...state.activites.messages.read,
      //     ...this.messages,
      //   ];
      //   newState.activites.messages.readPage =
      //     state.activites.messages.readPage + 1;
      // });
    });
  }
}

export class ActivityMarkAsRead implements WatchEvent, UpdateEvent {
  public constructor(private messageId: string, private onSucess) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activites.messages.unread =
        state.activites.messages.unread.filter(
          (message: ActivityMessageDto) =>
            message.id != this.messageId,
        );

      const message = state.activites.messages.unread.find(
        (message: ActivityMessageDto) => message.id == this.messageId,
      );
      newState.activites.messages.read = [
        ...state.activites.messages.read,
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
      newState.activites.messages.read = [
        ...state.activites.messages.unread.map((message) => {
          return { ...message, unread: false };
        }),
        ...state.activites.messages.read,
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
      const message = state.activites.messages.unread.find(
        (message: ActivityMessageDto) => message.id == this.messageId,
      );
      newState.activites.messages.read = _.uniqBy([...state.activites.messages.read,{...message, notified: true}], 'id')
      // newState.activites.messages.read = [
      //   ...state.activites.messages.read,
      //   message,
      // ];
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
    (state: GlobalState) => state.activites.messages,
  );
  const notifications = useGlobalStore(
    (state: GlobalState) => state.activites.notifications,
  );

  return { messages, notifications };
};

export const usePoolFindNewActivities = ({ timeMs }) => {
  const messagesUnread = useGlobalStore(
    (state: GlobalState) => state.activites.messages.unread,
  );

  useEffect(() => {
    if (messagesUnread) {
      messagesUnread.forEach((message) => {
        // store.emit(new ActivityNotified(message.id));
        // if(!message.notified)
        // {
        //   alertService.info(message.messageExcerpt);
        // }
      });
    }
  }, [messagesUnread]);
  const loggedInUser = useGlobalStore(
    (state: GlobalState) => state.loggedInUser,
  );
  const increment = useCallback(() => {
    store.emit(new FindNewMessages());
  }, []);
  useInterval(increment, timeMs, { paused: !loggedInUser });
};

// export class SendMessageToAdmins implements WatchEvent {
//   public constructor(private onSuccess) {}

//   public watch(state: GlobalState) {
//     if(!state.loggedInUser)
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
