import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'state';
import { useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
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

export function DesktopNotificationsButton({allowedToNotify}) {

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
          dconsole.log(getperm);
          store.emit(new PermissionGranted());
        } else {
          store.emit(new PermissionRevoke());
        }
      });
    }
  };
  return (
    <>
      {!allowedToNotify && (
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
