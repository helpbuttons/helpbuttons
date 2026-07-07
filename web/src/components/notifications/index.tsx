'use client'

import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { GlobalState, store } from 'state';
import { useEffect, useState } from 'react';
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

export function DesktopNotificationsButton({allowedToNotify}) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  useEffect(() => {
    if (isSupported() && Notification.permission === 'granted') {
      // Check if the browser supports notifications
      store.emit(new PermissionGranted());
    }
  }, []);
  const requestPermission = () => {

    if (isSupported()) {
      registerServiceWorker()
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
    console.log('TODO')
        store.emit(new PermissionGranted());

        return;
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      setSubscription(sub)
      const serializedSub = JSON.parse(JSON.stringify(sub))
    //   await subscribeUser(serializedSub)
  }
  async function unsubscribeFromPush() {
    store.emit(new PermissionRevoke());
    //   await subscription?.unsubscribe()
    setSubscription(null)
    //   await unsubscribeUser()
  }
  return (
    <>
      {!allowedToNotify ? (
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
