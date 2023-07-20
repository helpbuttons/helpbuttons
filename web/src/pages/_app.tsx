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

import { useRef, useStore } from 'store/Store';
import { GetConfig } from 'state/Setup';
import { alertService } from 'services/Alert';
import { SetupSteps } from '../shared/setupSteps';
import { SetupDtoOut } from 'shared/entities/setup.entity';

import { pathToRegexp } from 'path-to-regexp';
import { allowedPathsPerRole } from '../shared/pagesRoles';
import { Role } from 'shared/types/roles';
import { isRoleAllowed } from 'shared/sys.helper';
import { version } from 'shared/commit';
import Loading from 'components/loading';
import { getMetadata } from 'services/ServerProps';
import SEO from 'components/seo';
import { FindActivities } from 'state/Activity';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);
  const [noBackend, setNobackend] = useState(false);

  const config = useStore(store, (state: GlobalState) => state.config);
  const path = router.asPath.split('?')[0];

  const [metadata, setMetadata] = useState(null)

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
            if (
              !setupPaths.includes(path)
            ) {
              fetchDefaultNetwork(config);
            }
          },
          (error) => {
            if(SetupSteps.SYSADMIN_CONFIG.toString() == path || SetupSteps.CREATE_ADMIN_FORM.toString() == path)
            {
              return;
            }
            if (error == 'not-found' || error == 'nosysadminconfig') {
              console.error(error)
              router.push(SetupSteps.SYSADMIN_CONFIG);
            }

            if (error == 'nobackend') {
              alertService.error(`Backend not found, something went terribly wrong.`)
              router.push('/Error')
            }
            console.log(error)
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
                  (configuration.databaseNumberMigrations < 1 || configuration.userCount < 1) &&
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
                  console.error('network not found')
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

  useEffect(() => {
    if(loggedInUser && !activities)
    {
      store.emit(
              new FindActivities(
                (error) => {
                  alertService.error('Error getting activities');
                },
              ),
            );
    }
  }, [loggedInUser, activities])
  useEffect(() => {
    if(config && selectedNetwork)
    {
      setMetadata(() => {
        return getMetadata('lala', selectedNetwork, config, 'fail')
      })
    }
  },[config, selectedNetwork])
  
  const pageName = path.split('/')[1]

  return (
    <>
      <Head>
        <title>Helpbuttons.org</title>
        <meta name="commit" content={version.git} />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
      </Head>
      {metadata && <SEO {...metadata}/>}
      <div className={`${user ? '' : ''}`}>
        <Alert />
        {(() => {
          if (config && authorized && selectedNetwork) {
            return (
              <div>
                <Component {...pageProps} />
                <NavBottom/>
              </div>
            );
          } else if (isSetup || ['Login','HomeInfo','ButtonFile'].indexOf(pageName) > -1) {
            return (
              <div>
                <Component {...pageProps} />
              </div>
            );
          } else if (noBackend) {
            return <>NO BACKEND!!</>;
          }

          return <Loading/>;
        })()}        
      </div>
    </>
  );
}
