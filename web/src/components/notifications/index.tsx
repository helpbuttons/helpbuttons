'use client'
import getEnvConfig from 'next/config';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'state';
import { useCallback, useEffect, useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import {
  PermissionGranted,
  PermissionRevoke,
} from 'state/Activity';
import { useGlobalStore } from 'state';
import dconsole from 'shared/debugger';
import { PushSubscribe, PushUnsubscribe } from 'state/Push';

const isSupported = () =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window;



function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function DesktopNotificationsButton({ allowedToNotify }) {

  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )


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
      subscribeToPush()
    }
  };


  async function subscribeToPush() {
    const { publicRuntimeConfig } = getEnvConfig();
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        publicRuntimeConfig.vapiPublicKey
      ),
    })
    setSubscription(sub)
    store.emit(new PushSubscribe(sub))
    store.emit(new PermissionGranted());
  }
  async function unsubscribeFromPush() {
    store.emit(new PermissionRevoke());
    store.emit(new PushUnsubscribe())
    setSubscription(null)
  }
  const sessionUser = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
);
  const isSubscribe = sessionUser.pushSubscribed;
  return (
    <>
      {!allowedToNotify || !isSubscribe ? (
        <Btn
          btnType={BtnType.filterCorp}
          iconLink={<IoNotificationsOutline />}
          caption={t('homeinfo.notificationsPermission')}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={requestPermission}
        />
      ) :
        <Btn
          btnType={BtnType.filterCorp}
          iconLink={<IoNotificationsOutline />}
          caption={t('homeinfo.unsubscribePush')}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={unsubscribeFromPush}
        />
      }
    </>
  );
}

