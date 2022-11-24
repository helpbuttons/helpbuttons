import type { AppProps } from 'next/app';
import '../styles/app.scss';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBottom from 'components/nav/NavBottom'; //just for mobile
import Alert from 'components/overlay/Alert';
import { httpService } from 'services/HttpService';
import { UserService } from 'services/Users';
import { appWithTranslation } from 'next-i18next';
import { GlobalState, store } from 'pages';
import { FetchDefaultNetwork } from 'state/Networks';
import { FetchUserData, SetCurrentUser } from 'state/Users';

import { useRef } from 'store/Store';
import SysadminConfig from './Setup/SysadminConfig';
import { GetConfig } from 'state/Setup';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [sysadminConfig, setSysadminConfig] = useState(false);
  
  const config = useRef(store, (state: GlobalState) => state.config);
  
  const currentUser = useRef(
    store,
    (state: GlobalState) => state.users.currentUser,
  );

  // Whenever we log in or log out, fetch user data
  httpService.isAuthenticated$.subscribe((isAuthenticated) => {
    if (isAuthenticated && !currentUser) {
      store.emit(
        new FetchUserData(
          () => {},
          (err) => {
            UserService.logout();
          },
        ),
      );
    } else if (!isAuthenticated && currentUser) {
      store.emit(new SetCurrentUser(undefined));
    }
  });

  useEffect(() => {
    if (config) {
      // on route change start - hide page content by setting authorized to false
      authCheck();

      // load the default network and make it available globally
      store.emit(new FetchDefaultNetwork());
    }else if(!config) {
      store.emit(new GetConfig(()=>{
        console.log('got a new config!! from the api')
      },()=>{
        console.log('route to sysadmin setup!!');
      }));
    }
  }, []);

  function authCheck() {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = [
      '/Login',
      '/Signup',
      '/RepositoryPage',
      '/Faqs',
      '/',
      '/ButtonNew',
      '/Explore',
      '/HomeInfo',
      '/ButtonFile/[id]',
    ];
    const path = router.asPath.split('?')[0];

    if (!UserService.isLoggedIn() && !publicPaths.includes(path)) {
      // and is not 404
      if (path != '/Login') {
        router
          .push({
            pathname: '/Login',
            query: { returnUrl: router.asPath },
          })
          .catch((err) => {
            // console.log(err)
          });
      }
    } else {
      setAuthorized(true);
    }
  }

  return (
    <>
      <Head>
        <title>Helpbuttons.org</title>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
      </Head>
        <div className={`${user ? '' : ''}`}>
          {authorized && <Component {...pageProps} />}
          <Alert />
          <NavBottom logged={!!currentUser} />
        </div>
    </>
  );
}
