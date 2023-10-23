import type { AppProps } from 'next/app';
import '../styles/app.scss';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import NavBottom from 'components/nav/NavBottom'; //just for mobile
import Alert from 'components/overlay/Alert';
import { httpService } from 'services/HttpService';
import { UserService } from 'services/Users';
import { appWithTranslation } from 'next-i18next';
import { GlobalState, store } from 'pages';
import { FetchDefaultNetwork } from 'state/Networks';
import { FetchUserData } from 'state/Users';

import { useRef, useStore } from 'store/Store';
import { GetConfig } from 'state/Setup';
import { alertService } from 'services/Alert';
import { SetupSteps } from '../shared/setupSteps';
import { SetupDtoOut } from 'shared/entities/setup.entity';

import { pathToRegexp } from 'path-to-regexp';
import { allowedPathsPerRole } from '../shared/pagesRoles';
import { Role } from 'shared/types/roles';
import { getLocale, isRoleAllowed } from 'shared/sys.helper';
import { version } from 'shared/commit';
import Loading from 'components/loading';
import { getMetadata } from 'services/ServerProps';
import SEO from 'components/seo';
import { refeshActivities } from 'state/Activity';
import t from 'i18n';
import { useInterval } from 'shared/custom.hooks';

export default appWithTranslation(MyApp);

const useActivitesPool = (loggedInUser) => {
  const increment = useCallback(() => refeshActivities(), []);
  useInterval(increment, 10000, { paused: !loggedInUser });
};
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);
  const [noBackend, setNobackend] = useState(false);

  const config = useStore(
    store,
    (state: GlobalState) => state.config,
  );
  const path = router.asPath.split('?')[0];

  const [metadata, setMetadata] = useState(null);

  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  const activities = useStore(
    store,
    (state: GlobalState) => state.activities,
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
    }

    if (!config) {
      store.emit(
        new GetConfig(
          (config) => {
            console.log(`got config`);
            if (!setupPaths.includes(path)) {
              fetchDefaultNetwork(config);
            }
          },
          (error) => {
            if (
              SetupSteps.SYSADMIN_CONFIG.toString() == path ||
              SetupSteps.CREATE_ADMIN_FORM.toString() == path
            ) {
              return;
            }
            if (error == 'not-found' || error == 'nosysadminconfig') {
              console.error(error);
              router.push(SetupSteps.SYSADMIN_CONFIG);
            }

            if (error == 'nobackend') {
              alertService.error(
                `Backend not found, something went terribly wrong.`,
              );
              router.push('/Error');
            }
            console.log(error);
            return;
          },
        ),
      );
    }
    if (
      !authorized &&
      config &&
      config.userCount < 1 &&
      (path == SetupSteps.CREATE_ADMIN_FORM || path == '/Login')
    ) {
      setAuthorized(true);
    }
    if (!authorized) {
      if (UserService.isLoggedIn()) {
        // check if local storage has a token
        if (!loggedInUser) {
          if (!isLoadingUser) {
            store.emit(
              new FetchUserData(
                () => {
                  setIsLoadingUser(false);
                },
                (error) => {
                  // if local storage has a token, and fails to fetchUserData then delete storage token
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
        if (config) {
          if (
            config.userCount < 1 &&
            path == SetupSteps.CREATE_ADMIN_FORM
          ) {
            setAuthorized(true);
          } else {
            setAuthorized(isRoleAllowed(Role.guest, path));
          }
        } else if (
          path != SetupSteps.CREATE_ADMIN_FORM &&
          path != SetupSteps.SYSADMIN_CONFIG
        ) {
          setAuthorized(isRoleAllowed(Role.guest, path));
        }
      }
    }

    function fetchDefaultNetwork(configuration) {
      if (configuration && !selectedNetwork && !isLoadingNetwork) {
        setIsLoadingNetwork(true);
        store.emit(
          new FetchDefaultNetwork(
            () => {
              console.log('all is ready!');
            },
            (error) => {
              if (error === 'network-not-found') {
                if (
                  (configuration.databaseNumberMigrations < 1 ||
                    configuration.userCount < 1) &&
                  SetupSteps.CREATE_ADMIN_FORM != path
                ) {
                  router.push(SetupSteps.CREATE_ADMIN_FORM);
                } else if (
                  loggedInUser &&
                  (SetupSteps.NETWORK_CREATION == path ||
                    SetupSteps.FIRST_OPEN == path)
                ) {
                  router.push({
                    pathname: '/Login',
                    query: { returnUrl: path },
                  });
                } else {
                  console.error('network not found');
                  console.error(error);
                  router.push({
                    pathname: SetupSteps.FIRST_OPEN,
                  });
                }
              }
            },
          ),
        );
      }
    }
  }, [path, config, loggedInUser]);

  useActivitesPool(loggedInUser);

  useEffect(() => {
    // Function to adjust the height of the index__container based on the actual viewport height
    const adjustHeight = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Call the function on initial load and whenever the window is resized
    adjustHeight();
    window.addEventListener('resize', adjustHeight);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, [config, selectedNetwork]);

  const pageName = path.split('/')[1];
  let [networkBackgroundColor, setNetworkBackgroundColor] =
    useState('#FFDD02');
  let [networkTextColor, setNetworkTextColor] = useState('black');
  const { pathname, asPath, query, locale } = useRouter()
  
  useEffect(() => {
    if (selectedNetwork?.backgroundColor) {
      setNetworkBackgroundColor(
        () => selectedNetwork.backgroundColor,
      );
    }
    if (selectedNetwork?.textColor) {
      setNetworkTextColor(() => selectedNetwork.textColor);
    }
    if (selectedNetwork)
    {
      if(!loggedInUser && getLocale() != selectedNetwork.locale)
      {
        if(selectedNetwork.locale != 'en')
        {
          console.log('changing to network locale...' + selectedNetwork.locale)
          router.push({ pathname, query }, asPath, { locale: selectedNetwork.locale })
        }
      }
    }
  }, [selectedNetwork, loggedInUser]);

  return (
    <>
      <Head>
        <title>Helpbuttons.org</title>
        <meta name="commit" content={version.git} />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
      </Head>
      <div
        className={`${user ? '' : 'index__container'}`}
        style={
          {
            '--network-background-color': networkBackgroundColor,
            '--network-text-color': networkTextColor,
          } as React.CSSProperties
        }
      >
        <Alert />
        <div className="index__content">
          <Component {...pageProps} />
          <NavBottom />
        </div>
      </div>
    </>
  );
}

export const ClienteSideRendering = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (<>
    {isClient && children}</>
  );
};