import '../styles/app.scss';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Router, useRouter } from 'next/router';
import NavBottom from 'components/nav/NavBottom'; //just for mobile
import Alert from 'components/overlay/Alert';
import { UserService } from 'services/Users';
import { appWithTranslation } from 'next-i18next';
import { GlobalState, store } from 'pages';
import { useSelectedNetwork } from 'state/Networks';
import { FetchUserData, LoginToken } from 'state/Users';

import { useGlobalStore, useStore } from 'store/Store';
import { alertService } from 'services/Alert';
import { SetupSteps } from '../shared/setupSteps';

import { Role } from 'shared/types/roles';
import {
  getLocale,
  isRoleAllowed,
  setSSRLocale,
} from 'shared/sys.helper';
// import { version } from 'shared/commit';
import t, { updateNomeclature } from 'i18n';
import { useSearchParams } from 'next/navigation';
import NavHeader from 'components/nav/NavHeader';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import SEO from 'components/seo';
import Loading, { LoadabledComponent } from 'components/loading';
import MainPopup from 'components/popup/Main/';
import { DesktopNotifications } from 'components/notifications';
import { useConfig } from 'state/Setup';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [fetchingNetworkError, setFetchingNetworkError] = useState(false)
  const path = router.asPath.split('?')[0];

  const selectedNetworkLoading = useGlobalStore((state: GlobalState) =>
  state.networks.selectedNetworkLoading)
  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const onFetchingNetworkError = (error) => {
    if (error === 'network-not-found') {
      setFetchingNetworkError(true)     
    }
  };

  const onFetchingConfigError = (error) => {
    console.log(error);
    console.log('fetching config error...');
    if (error == 'not-found' || error == 'nosysadminconfig') {
      console.error(error);
      console.log('config not found? contact your sysadmin');
    }

    if (error == 'nobackend') {
      alertService.error(
        `Error: Backend not found, something went terribly wrong.`,
      );
      router.push('/Error');
    }
    console.log(error);
    return;
  };

  const config = useConfig(pageProps._config, onFetchingConfigError);
  const selectedNetwork = useSelectedNetwork(
    pageProps._selectedNetwork,
    onFetchingNetworkError,
  );
  const setupPaths: string[] = [
    SetupSteps.CREATE_ADMIN_FORM,
    SetupSteps.FIRST_OPEN,
    SetupSteps.NETWORK_CREATION,
  ];
  useEffect(() => {
    if (
      fetchingNetworkError &&
      loggedInUser &&
      config &&
      config.userCount > 0 &&
      path != SetupSteps.FIRST_OPEN &&
      path != SetupSteps.NETWORK_CREATION
    ) {
      router.push(SetupSteps.FIRST_OPEN);
    }
  }, [fetchingNetworkError, loggedInUser])

  useEffect(() => {
    if (setupPaths.includes(path)) {
      setIsSetup(() => true);
    } else {
      setIsSetup(() => false);
    }

    if (
      config &&
      config.userCount < 1 &&
      SetupSteps.CREATE_ADMIN_FORM != path &&
      !loggedInUser
    ) {
      router.push(SetupSteps.CREATE_ADMIN_FORM);
    } else if (
      SetupSteps.CREATE_ADMIN_FORM == path &&
      loggedInUser &&
      loggedInUser.role == Role.admin
    ) {
      router.push(SetupSteps.FIRST_OPEN);
    }
    if (SetupSteps.CREATE_ADMIN_FORM.toString() == path) {
      return;
    }

    if (
      !authorized &&
      config &&
      config.userCount < 1 &&
      (path == SetupSteps.CREATE_ADMIN_FORM || path == '/Login')
    ) {
      setAuthorized(true);
    }
    // if (!authorized) {
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
      } else if (path != SetupSteps.CREATE_ADMIN_FORM) {
        setAuthorized(isRoleAllowed(Role.guest, path));
      }
    }
    // }
  }, [path, config, loggedInUser]);

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

  useEffect(() => {
    if (selectedNetwork) {
      updateNomeclature(
        selectedNetwork.nomeclature,
        selectedNetwork.nomeclaturePlural,
      );
      setSSRLocale(selectedNetwork.locale);
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (loggedInUser) {
      if (getLocale() != loggedInUser.locale) {
        setSSRLocale(loggedInUser.locale);
      }
    }
  }, [loggedInUser]);

  const searchParams = useSearchParams();
  const triedToLogin = useRef(false);
  useEffect(() => {
    const loginToken = searchParams.get('loginToken');
    if (
      !triedToLogin.current &&
      loginToken &&
      pageName != 'LoginClick'
    ) {
      const onSuccess = () => {
        alertService.success(t('user.loginSucess'));
      };

      const onError = (err) => {
        alertService.error(t('login.error'));
      };
      store.emit(new LoginToken(loginToken, onSuccess, onError));
    } else if (loginToken) {
      triedToLogin.current = true;
    }
  }, [searchParams]);

  const [loading, setLoading] = useState<boolean>(false);

  Router.events.on('routeChangeStart', (url) => {
    setLoading(true);
  });

  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false);
  });

  if (isSetup) {
    return <Component {...pageProps} />;
  } else if (pageName == 'Embbed') {
    return (
      <LoadabledComponent loading={!selectedNetwork || loading}>
        <Component {...pageProps} />
      </LoadabledComponent>
    );
  } else if (!selectedNetworkLoading) {
    return (
      <>
        <Head>
          <title>Helpbuttons.org</title>
          <meta name="commit" content={'todo'} />
        </Head>
        {pageProps.metadata ? (
          <SEO {...pageProps.metadata} />
        ) : (
          <Head>
            <title>{selectedNetwork?.name}</title>
          </Head>
        )}
        <ClienteSideRendering>
          <DesktopNotifications />
        </ClienteSideRendering>
        <div
          className="index__container"
          style={
            selectedNetwork
              ? ({
                  '--network-background-color':
                    selectedNetwork.backgroundColor,
                  '--network-text-color': selectedNetwork.textColor,
                } as React.CSSProperties)
              : ({
                  '--network-background-color': 'grey',
                  '--network-text-color': 'pink',
                } as React.CSSProperties)
          }
        >
          <Alert />

          <div className="index__content">
            <ShowDesktopOnly>
              <NavHeader
                pageName={pageName}
                selectedNetwork={selectedNetwork}
              />
            </ShowDesktopOnly>
            <Component {...pageProps} />
            <ShowMobileOnly>
              <ClienteSideRendering>
                <NavBottom
                  pageName={pageName}
                  loggedInUser={loggedInUser}
                />
              </ClienteSideRendering>
            </ShowMobileOnly>
            <MainPopup />
          </div>
        </div>
      </>
    );
  }

  return <Loading />;
}

export const ClienteSideRendering = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return <>{isClient && children}</>;
};
