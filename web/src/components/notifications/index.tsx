import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'state';
import { useEffect } from 'react';
import { IoNotificationsOffOutline, IoNotificationsOutline } from 'react-icons/io5';
import {
  PermissionGranted,
  PermissionRevoke,
} from 'state/Activity';
import { useGlobalStore } from 'state';
import dconsole from 'shared/debugger';

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
      store.emit(new PermissionGranted());
    }
  }, []);

  const handleClick = () => {
    if (!isSupported()) return;
    if (hasNotificationPermissions) {
      store.emit(new PermissionRevoke());
    } else {
      Notification.requestPermission().then(function (getperm) {
        if (getperm == 'granted') {
          dconsole.log(getperm);
          store.emit(new PermissionGranted());
        } else {
          store.emit(new PermissionRevoke());
        }
      });
    }
  };

  if (!isSupported()) return null;

  return (
    <Btn
      btnType={BtnType.filterCorp}
      iconLink={hasNotificationPermissions ? <IoNotificationsOffOutline /> : <IoNotificationsOutline />}
      caption={hasNotificationPermissions ? t('homeinfo.revokeNotifications', [], true) : t('homeinfo.notificationsPermission', [], true)}
      iconLeft={IconType.svg}
      contentAlignment={ContentAlignment.center}
      onClick={handleClick}
    />
  );
}
