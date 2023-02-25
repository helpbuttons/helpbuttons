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
import { FetchUserData } from 'state/Users';

import { useRef } from 'store/Store';
import { GetConfig } from 'state/Setup';
import { alertService } from 'services/Alert';
import { SetupSteps } from '../shared/setupSteps';
import { SetupDtoOut } from 'shared/entities/setup.entity';

import { pathToRegexp } from 'path-to-regexp';
import { allowedPathsPerRole } from '../shared/pagesRoles';
import { Role } from 'shared/types/roles';
import { isRoleAllowed } from 'shared/sys.helper';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);

  const config = useRef(store, (state: GlobalState) => state.config);
  const path = router.asPath.split('?')[0];

  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  const setupPaths: string[] = [
    SetupSteps.CREATE_ADMIN_FORM,
    SetupSteps.FIRST_OPEN,
    SetupSteps.NETWORK_CREATION,
    SetupSteps.SYSADMIN_CONFIG,
  ];

  useEffect(() => {
    if (setupPaths.includes(path)) {
      setIsSetup(true);
      return;
    }

    if(path != SetupSteps.SYSADMIN_CONFIG){
      fetchDefaultNetwork();
    }

    if (!config && SetupSteps.SYSADMIN_CONFIG.toString() != path) {
      store.emit(
        new GetConfig(
          () => console.log(`got config`),
          () => router.push(SetupSteps.SYSADMIN_CONFIG),
        ),
      );
    }
    if (!authorized) {
      if (UserService.isLoggedIn()) { // check if local storage has a token
        if (!loggedInUser) {
          if (!isLoadingUser) {
            store.emit(
              new FetchUserData(
                () => {
                  setIsLoadingUser(false);
                },
                (error) => { // if local storage has a token, and fails to fetchUserData then delete storage token
                  UserService.logout();
                  setIsLoadingUser(false);
                },
              ),
            );
          }
          setIsLoadingUser(true);
        } else {
          setAuthorized(isRoleAllowed(loggedInUser.role, path));
        }
      } else {
        setAuthorized(isRoleAllowed(Role.guest, path));
      }
    }

    function fetchDefaultNetwork() {
      if (config && !selectedNetwork) {
        if (isLoadingNetwork) {
          return false;
        }
        setIsLoadingNetwork(true);
        store.emit(
          new FetchDefaultNetwork(
            () => {
              console.log('all is ready!');
            },
            (error) => {
              if (error === 'network-not-found') {
                if (config.databaseNumberMigrations < 1) {
                  alertService.error(
                    `Missing database schema, please run schema creation/migrations! and then <a href="/">click here</a>`,
                  );
                  return;
                } else if (
                  config.userCount < 1 &&
                  SetupSteps.CREATE_ADMIN_FORM != path
                ) {
                  router.push(SetupSteps.CREATE_ADMIN_FORM);
                } else {
                  router.push(SetupSteps.FIRST_OPEN);
                }
              } else {
                alertService.error('unknown error');
                console.error(error);
              }
            },
          ),
        );
      }
    }
  }, [path, isSetup, authorized, config, loggedInUser]);

  return (
    <>
      <Head>
        <title>Helpbuttons.org</title>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
      </Head>
      <div className={`${user ? '' : ''}`}>
        <Alert />
        {(() => {
          if (config && authorized && selectedNetwork) {
            return (
              <div>
                <Component {...pageProps} />
                <NavBottom logged={!!loggedInUser} />
              </div>
            );
          } else if (isSetup) {
            return (
              <div>
                <Component {...pageProps} />
              </div>
            );
          }

          return <div>Loading...</div>;
        })()}
      </div>
    </>
  );
}
