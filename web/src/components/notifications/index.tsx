import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect, useRef } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { ActivityMessageDto } from 'shared/dtos/activity.dto';
import {
  PermissionGranted,
  PermissionRevoke,
  useActivities,
} from 'state/Activity';
import { useGlobalStore, useStore } from 'store/Store';

const isSupported = () =>
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;

export function DesktopNotificationsButton() {
  const hasNotificationPermissions = useGlobalStore(
    (state: GlobalState) =>
      state.activites.notificationsPermissionGranted,
  );

  useEffect(() => {
    if (isSupported() && Notification.permission === 'granted') {
      // Check if the browser supports notifications
      store.emit(new PermissionGranted());
    }
  }, []);
  const requestPermission = () => {

    if (isSupported()) {
      Notification.requestPermission().then(function (getperm) {
        if (getperm == 'granted') {
          console.log(getperm);
          store.emit(new PermissionGranted());
        } else {
          store.emit(new PermissionRevoke());
        }
      });
    }
  };
  return (
    <>
      {!hasNotificationPermissions && (
        <Btn
          btnType={BtnType.filterCorp}
          iconLink={<IoNotificationsOutline />}
          caption={t('homeinfo.notificationsPermission')}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={requestPermission}
        />
      )}
    </>
  );
}

export function DesktopNotifications() {
  const hasNotificationPermissions = useGlobalStore(
    (state: GlobalState) =>
      state.activites.notificationsPermissionGranted,
  );

  const {messages, notifications} = useActivities()

  const notificationsShown = useRef(false);
  const maxMessagesToNotify = 5;
  useEffect(() => {
    if (
      messages &&
      messages.length > 0 &&
      !notificationsShown.current
    ) {
      notificationsShown.current = true;

      messages
        .filter((message) => !message.read)
        .slice(0, maxMessagesToNotify)
        .map((message: ActivityMessageDto) => {
          alertService.info(`You have a new message from: ${message.authorName}<br/>"${message.messageExcerpt}"`);
          if(messages.length > maxMessagesToNotify)
          {
            alertService.warn(t('feed.manyUnreadMessages', [messages.length]))
          }
        });
      // mark as read, if permissions to send notifications are given, dunno if best behavior.
      // if (hasNotificationPermissions) {
      //   if (
      //     activities.filter((activity) => !activity.read).length > 0
      //   ) {
          // alertService.info(t('activities.markedAllNotificationsAsRead'));
          // store.emit(new ActivityMarkAllAsRead());

      //   }
      // }
    }
  }, [messages]);

  
  return <></>;
}
