import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'state';
import { useEffect, useRef } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { ActivityMessageDto } from 'shared/dtos/activity.dto';
import {
  PermissionGranted,
  PermissionRevoke,
  useActivities,
} from 'state/Activity';
import { useGlobalStore } from 'state';

const isSupported = () =>
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;

export function DesktopNotificationsButton() {
  const hasNotificationPermissions = useGlobalStore(
    (state: GlobalState) =>
      state.activities.notificationsPermissionGranted,
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
