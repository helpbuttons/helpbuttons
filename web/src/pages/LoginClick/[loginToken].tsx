//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalState, store } from 'state';
import { LoginToken } from 'state/Profile';
import { alertService } from 'services/Alert';
import t from 'i18n';
import { useStore } from 'state';

export default function LoginClick() {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    const onSuccess = () => {
      let returnUrl: string = '/Explore';
      if (router?.query?.returnUrl) {
        returnUrl = router.query.returnUrl.toString();
      }
      alertService.success(t('user.loginSucess'));
      router.push(returnUrl);
    };

    const onError = (err) => {
      alertService.error(t('user.loginError'));
      router.push('/');
    };
    if (!initialized.current) {
      initialized.current = true;
      const loginToken = router.query.loginToken as string;
      store.emit(new LoginToken(loginToken, onSuccess, onError));
    }
  }, [router.isReady]);

  return (
    <>
      <div>Logging in...</div>
    </>
  );
}
