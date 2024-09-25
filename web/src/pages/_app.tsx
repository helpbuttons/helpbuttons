import '../styles/app.scss';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Router, useRouter } from 'next/router';
import NavBottom from 'components/nav/NavBottom'; //just for mobile
import Alert from 'components/overlay/Alert';
import { UserService } from 'services/Users';
import { appWithTranslation } from 'next-i18next';
import { GlobalState, store } from 'pages';
import { useConfig, useSelectedNetwork } from 'state/Networks';
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
import { LoadabledComponent } from 'components/loading';
import {
  ActivityMarkAllAsRead,
  PermissionGranted,
  PermissionRevoke,
} from 'state/Activity';
import { IoNotificationsOutline } from 'react-icons/io5';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { MainPopup } from './popup';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);

  const path = router.asPath.split('?')[0];

  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const onFetchingNetworkError = (error) => {
    if (error === 'network-not-found') {
      console.error(error);

      if (
        loggedInUser &&
        config &&
        config.userCount > 0 &&
        path != SetupSteps.FIRST_OPEN &&
        path != SetupSteps.NETWORK_CREATION
      ) {
        console.log('pushing to first open');
        router.push(SetupSteps.FIRST_OPEN);
      }
    }
  };

  const onFetchingConfigError = (error) => {
    console.log(error);
    console.log('fetching config error...');
    if (error == 'not-found' || error == 'nosysadminconfig') {
      console.error(error);
      console.log('pushing sysadmin config');
      router.push(SetupSteps.SYSADMIN_CONFIG);
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

  const selectedNetwork = useSelectedNetwork(
    pageProps._selectedNetwork,
    onFetchingNetworkError,
  );
  const config = useConfig(pageProps._config, onFetchingConfigError);
  const setupPaths: string[] = [
    SetupSteps.CREATE_ADMIN_FORM,
    SetupSteps.FIRST_OPEN,
    SetupSteps.NETWORK_CREATION,
    SetupSteps.SYSADMIN_CONFIG,
  ];
  useEffect(() => {
    if (setupPaths.includes(path)) {
      setIsSetup(() => true);
    } else {
      setIsSetup(() => false);
    }

    if (
      config &&
      (config.databaseNumberMigrations < 1 || config.userCount < 1) &&
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
    if (
      SetupSteps.SYSADMIN_CONFIG.toString() == path ||
      SetupSteps.CREATE_ADMIN_FORM.toString() == path
    ) {
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
      } else if (
        path != SetupSteps.CREATE_ADMIN_FORM &&
        path != SetupSteps.SYSADMIN_CONFIG
      ) {
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
  }
  if (pageName == 'Embbed') {
    return (
      <LoadabledComponent loading={!selectedNetwork || loading}>
        <Component {...pageProps} />
      </LoadabledComponent>
    );
  }
  return (
    <>
      <Head>
        <title>Helpbuttons.org</title>
        {/* <meta name="commit" content={version.git} /> */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
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
        className={`${user ? '' : 'index__container'}`}
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
          <LoadabledComponent loading={!selectedNetwork || loading}>
            <Component {...pageProps} />
          </LoadabledComponent>
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

export const ClienteSideRendering = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return <>{isClient && children}</>;
};


export function DesktopNotificationsButton() {
  const hasNotificationPermissions = useGlobalStore(
    (state: GlobalState) =>
      state.activitesState.notificationsPermissionGranted,
  );

  const requestPermission = () => {
    const isSupported = () =>
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;

    if (isSupported()) {
      Notification.requestPermission().then(function (getperm) {
        if (getperm == 'granted') {
          console.log(getperm);
          store.emit(new PermissionGranted());
        } else {
          store.emit(new PermissionRevoke());
        }
      });
    }
  };
  return (
    <>
      {!hasNotificationPermissions && (
        <Btn
          btnType={BtnType.filterCorp}
          iconLink={<IoNotificationsOutline />}
          caption={t('homeinfo.notificationsPermission')}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={requestPermission}
        />
      )}
    </>
  );
}

function DesktopNotifications() {
  const hasNotificationPermissions = useGlobalStore(
    (state: GlobalState) =>
      state.activitesState.notificationsPermissionGranted,
  );

  const activities = useStore(
    store,
    (state: GlobalState) => state.activitesState.activities,
  );

  const notificationsShown = useRef(false);
  useEffect(() => {
    if (
      activities &&
      activities.length > 0 &&
      !notificationsShown.current
    ) {
      notificationsShown.current = true;

      activities
        .filter((activity) => !activity.read)
        .slice(0, 5)
        .map((activity: ActivityDtoOut) => {
          alertService.info(activity.title);
        });
      // mark as read, if permissions to send notifications are given, dunno if best behavior.
      if (hasNotificationPermissions) {
        if (
          activities.filter((activity) => !activity.read).length > 0
        ) {
          alertService.info(t('activities.markedAllAsRead'));
          store.emit(new ActivityMarkAllAsRead());
        }
      }
    }
  }, [activities]);

  return <></>;
}
