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
import { GetConfig } from 'state/Setup';
import { alertService } from 'services/Alert';
import {
  localStorageService,
  LocalStorageVars,
} from 'services/LocalStorage';
import { SetupSteps } from '../shared/setupSteps';
import { SetupDtoOut } from 'shared/entities/setup.entity';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const config = useRef(store, (state: GlobalState) => state.config);
  const path = router.asPath.split('?')[0];

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
    // if (config) {
    // on route change start - hide page content by setting authorized to false
    // load the default network and make it available globally
    const setupPaths: string[] = [
      SetupSteps.CREATE_ADMIN_FORM,
      SetupSteps.FIRST_OPEN,
      SetupSteps.INSTANCE_CREATION,
      SetupSteps.SYSADMIN_CONFIG,
    ];

    if (path != SetupSteps.SYSADMIN_CONFIG && !config) {
      console.log('tryiiing to load config');
      getConfig(
        (config: SetupDtoOut) => {
          
          console.log('loaded config....');
          console.log(config);
          if (config.databaseNumberMigrations < 1)
          {
            alertService.clearAll();
            alertService.error(
              `Missing migrations!`,
            );
            setIsSetup(true);
            router.push({
              pathname: SetupSteps.CREATE_ADMIN_FORM,
            });
          }else 
          if (config.userCount < 1) {
            alertService.clearAll();
            alertService.error(
              `Missing admin account, please <u><a href="${SetupSteps.CREATE_ADMIN_FORM}">create yours</a></u>!`,
            );
            setIsSetup(true);
            router.push({
              pathname: SetupSteps.CREATE_ADMIN_FORM,
            });
            return;
          }
          if (path != SetupSteps.CREATE_ADMIN_FORM) {
            getDefaultNetwork(
              () => {
                setIsSetup(true);
                console.log('all is ready!');
              },
              (error) => {
                if (error === 'network-not-found') {
                  if (config) {
                    alertService.warn(
                      `You didn't configured your instance yet. Go to the instance <a href="${SetupSteps.INSTANCE_CREATION}">configuration page</a>`,
                    );
                  } else {
                    alertService.warn(
                      `You dddidn't setup your instance yet. Go to the instance <a href="${SetupSteps.SYSADMIN_CONFIG}">setup page</a>`,
                    );
                  }
                } else {
                  alertService.error(JSON.stringify(error));
                  console.error(error);
                  router.push({
                    pathname: SetupSteps.SYSADMIN_CONFIG,
                  });
                }
              },
            );
          }
        },
        (err) => {

          if(err == 'nosysadminconfig') {
            alertService.error(
              err
            );  
          }
          
          if(err == 'need-migrations'){
            alertService.warn(
              err
            );  
          }
          router.push({
            pathname: SetupSteps.SYSADMIN_CONFIG,
          });
          console.error('oh noes.... whats going on?');
          alertService.error(
            'Something went wrong, sending you to configuration wizard',
          );
        },
      ); //if fails jumps to sysadmin config
    } else if (
      config 
    ) {
      console.log('authCheck');
      authCheck([SetupSteps.SYSADMIN_CONFIG,SetupSteps.CREATE_ADMIN_FORM]);
    }
  }, [path, isSetup, authorized]);

  function getConfig(onSuccess, onError) {
    store.emit(new GetConfig(onSuccess, onError));
  }

  function getDefaultNetwork(onSucess, onError) {
    store.emit(new FetchDefaultNetwork(onSucess, onError));
  }

  function authCheck(allowedGuestPaths) {
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

    if (!UserService.isLoggedIn() && !publicPaths.includes(path)
    //  && !allowedGuestPaths?.includes(path)
     ) {
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
        {authorized && (
          <div>
            <Component {...pageProps} />
            <Alert />
            <NavBottom logged={!!currentUser} />
          </div>
        )}
        {isSetup && (
          <div>
            <Component {...pageProps} />
            <Alert />
          </div>
        )}
      </div>
    </>
  );
}
