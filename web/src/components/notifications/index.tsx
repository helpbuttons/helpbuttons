import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect, useRef } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { ActivityDtoOut } from 'shared/dtos/activity.dto';
import {
  ActivityMarkAllAsRead,
  PermissionGranted,
  PermissionRevoke,
} from 'state/Activity';
import { useGlobalStore, useStore } from 'store/Store';

export function DesktopNotificationsButton() {
  const hasNotificationPermissions = useGlobalStore(
    (state: GlobalState) =>
      state.activitesState.notificationsPermissionGranted,
  );

  useEffect(() => {
    if (Notification && Notification.permission === 'granted') {
      // Check if the browser supports notifications
      store.emit(new PermissionGranted());
    }
  }, []);
  const requestPermission = () => {
    const isSupported = () =>
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;

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
      state.activitesState.notificationsPermissionGranted,
  );

  const activities = useStore(
    store,
    (state: GlobalState) => state.activitesState.activities,
  );

  const notificationsShown = useRef(false);
  useEffect(() => {
    if (
      activities &&
      activities.length > 0 &&
      !notificationsShown.current
    ) {
      notificationsShown.current = true;

      activities
        .filter((activity) => !activity.read)
        .slice(0, 5)
        .map((activity: ActivityDtoOut) => {
          alertService.info(activity.title);
        });
      // mark as read, if permissions to send notifications are given, dunno if best behavior.
      if (hasNotificationPermissions) {
        if (
          activities.filter((activity) => !activity.read).length > 0
        ) {
          alertService.info(t('activities.markedAllAsRead'));
          store.emit(new ActivityMarkAllAsRead());
        }
      }
    }
  }, [activities]);

  return <></>;
}
