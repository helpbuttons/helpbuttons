//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect } from 'react';
import router from 'next/router';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useToggle } from 'shared/custom.hooks';
import { LoginToken } from 'state/Users';
import { alertService } from 'services/Alert';

export default function LoginClick() {
  
  const loginToken = router.query.loginToken as string;

  const [loggingIn, setLoggingIn] = useToggle(false)
  useEffect(() => {
    const onSuccess = () => {
      let returnUrl: string = '/HomeInfo';
      if (router?.query?.returnUrl) {
        returnUrl = router.query.returnUrl.toString();
      }
      store.emit(router.push(returnUrl));
    };
  
    const onError = (err) => {
      alertService.error('failed to login, please try again');
      router.push('/HomeInfo')
    };
    if (!loggingIn)
    {
      setLoggingIn(true)
      store.emit(new LoginToken(loginToken, onSuccess,onError))
    }
  }, [loginToken])


  return (
    <>
    
      <div>Logging in...</div>

    </>
    
  );
}
