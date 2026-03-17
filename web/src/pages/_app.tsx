import '../styles/app.scss';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { NavBottomMobile } from 'components/nav/NavBottom'; //just for mobile
import Alert from 'components/overlay/Alert';
import { appWithTranslation } from 'next-i18next';
import { GlobalState, store } from 'state/';
import { useSelectedNetwork } from 'state/Networks';
import { FetchUserData, LoginToken } from 'state/Profile';
import { getReadableTextColor } from 'shared/helpers/color.helper'; 

import { useGlobalStore } from 'state';
import { alertService } from 'services/Alert';
import { SetupSteps } from '../shared/setupSteps';

import { Role } from 'shared/types/roles';
import {
  getLocaleFromUrl,
  isRoleAllowed,
  locale,
  setLocale,
} from 'shared/sys.helper';
import t, { updateNomeclature } from 'i18n';
import { useSearchParams } from 'next/navigation';
import NavHeader from 'components/nav/NavHeader';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import Loading from 'components/loading';
import MainPopup, { SetupMainPopup } from 'components/popup/Main/';
import { useConfig } from 'state/Setup';
import { UpdateMetadata } from 'state/Metadata';
import { randomBytes } from 'crypto'
import MetadataSEOFromStore, { MetadataSEO } from 'components/seo';
import dconsole from 'shared/debugger';
import Head from 'next/head';
import CookiesBanner from 'components/home/CookiesBanner';
import { MainPopupPage, SetMainPopup, SetPageName } from 'state/HomeInfo';
import { localStorageService, LocalStorageVars } from 'services/LocalStorage';
import { usePoolFindNewActivities } from 'state/Activity';
import { ResetFilters } from 'state/Explore';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [fetchingNetworkError, setFetchingNetworkError] = useState(false)
  const path = router.asPath.split('?')[0];
  const nonce = randomBytes(128).toString('base64')
  const isSetup = useIsSetup(path);

  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser)
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)

  const onFetchingConfigError = (error) => {
    dconsole.error(error);
    dconsole.error('fetching config error...');
    if (error == 'not-found' || error == 'nosysadminconfig') {
      console.error(error);
      dconsole.error('config not found? contact your sysadmin');
    }

    if (error == 'nobackend') {
      alertService.error(
        `Error: Backend not found, something went terribly wrong.`,
      );
      router.push('/Error');
    }
    dconsole.log(error);
    return;
  };
  
  useEffect(() => {
    store.emit(new SetPageName(getPageName(path.split('/')[1])))
    function getPageName(urlString) {
      const finit = urlString.indexOf("#") !== -1 ? urlString.indexOf("#") : (urlString.indexOf("?") !== -1 ? urlString.indexOf("?") !== -1 : null)
      if (finit) {
        return urlString.substr(0, finit)
      }
      if (!urlString) {
        return 'HomeInfo'
      }
      return urlString;
    }
  }, [path])

  const onFetchingNetworkError = (error) => {
    if (error == 'network-not-found') {
      alertService.error(t('networkNotFound'))
      setFetchingNetworkError(true)
    }

    if (error == 'nobackend') {
      alertService.error(
        `Error: Backend not found, something went terribly wrong.`,
      );
      router.push('/Error');
    }
    dconsole.log(error);
    return;
  };
  

  const config = useConfig(pageProps._config, onFetchingConfigError);
  const selectedNetwork = useSelectedNetwork(pageProps._selectedNetwork, onFetchingNetworkError);

  useEffect(() => {
    if (
      fetchingNetworkError &&
      sessionUser &&
      config &&
      config.userCount > 0 &&
      path != SetupSteps.FIRST_OPEN &&
      path != SetupSteps.NETWORK_CREATION
    ) {
      router.push(SetupSteps.FIRST_OPEN);
    }else if(fetchingNetworkError &&
      !sessionUser &&
      config &&
      config.userCount > 0 &&
      path != SetupSteps.FIRST_OPEN &&
      path != SetupSteps.NETWORK_CREATION &&
      !path.startsWith('/LoginClick')
    ){
        console.log(path)
        console.log('permission denied... you in setup')
        router.push(SetupSteps.SETUP_LOGIN);
      }
  }, [fetchingNetworkError, sessionUser, config])

  useEffect(() => {
    setAuthorized(() => false)

    if (
      config &&
      config.userCount < 1 &&
      SetupSteps.CREATE_ADMIN_FORM != path &&
      sessionUser === false
    ) {
      router.push(SetupSteps.CREATE_ADMIN_FORM);
    } else if (
      SetupSteps.CREATE_ADMIN_FORM == path &&
      sessionUser &&
      sessionUser.role == Role.admin
    ) {
      router.push(SetupSteps.FIRST_OPEN);
    }
    if (SetupSteps.CREATE_ADMIN_FORM.toString() == path) {
      return;
    }

    if (!config) {
      return;
    }
    if (config.userCount < 1 &&
      (path == SetupSteps.CREATE_ADMIN_FORM)
    ) {
      setAuthorized(() => true);
      return;
    }

    if (config && config.userCount > 0 && (path == SetupSteps.SETUP_LOGIN)
    ) {
      setAuthorized(() => true);
      return;
    }

    const loginToken = localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
    if (loginToken && sessionUser === false && ['Embbed'].indexOf(pageName) < 0) {
      if (!isLoadingUser) {
        setIsLoadingUser(true);
        store.emit(
          new FetchUserData(
            () => {
              setIsLoadingUser(false);
            },
            (error) => {
              setIsLoadingUser(false);
            },
          ),
        );
      }
      return;
    }
    if (isLoadingUser) {
      return;
    }
    if (sessionUser) {
      setAuthorized(isRoleAllowed(sessionUser.role, path));
      return;
    }
    const isAllowed = isRoleAllowed(Role.guest, path)

    if (!isAllowed) {
      console.log('not allowd')
      store.emit(new ResetFilters()) // TODO: bug when using router.back
      store.emit(new SetMainPopup(MainPopupPage.LOGIN))
      router.back()
      return;
    }
    setAuthorized(() => isAllowed);

  }, [path, config, sessionUser, pageName]);

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



  useEffect(() => {
    if (selectedNetwork) {
      updateNomeclature(
        selectedNetwork.nomeclature,
        selectedNetwork.nomeclaturePlural,
      );
    }
    if(([SetupSteps.CREATE_ADMIN_FORM.toString(), SetupSteps.FIRST_OPEN.toString(), SetupSteps.NETWORK_CREATION.toString()].indexOf(path) > -1 )&& selectedNetwork && selectedNetwork.id ){
      router.push('/')
    }
  }, [selectedNetwork]);

  useWhichLocale({ sessionLocale: sessionUser?.locale, networkLocale: selectedNetwork.locale });

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

  useEffect(() => {
    if (pageProps.metadata) {
      store.emit(new UpdateMetadata(pageProps.metadata))
    }
  }, [pageProps])

  return <>
    <MetadataSEO {...pageProps.metadata} nonce={nonce} />
    {(function () {

      if (isSetup) {
        return <> <Head>
          <title>Creating new helpbuttons network...</title></Head><Component {...pageProps} /><SetupMainPopup/></>;
      } else if (pageName == 'Embbed') {
        return (
          <Component {...pageProps} />
        );
      } else if (selectedNetwork.id) {
        return (
          <>
            <MetadataSEOFromStore nonce={nonce} />
            <ActivityPool sessionUser={sessionUser} />
            <div
              className="index__container"
              style={
                selectedNetwork
                  ? ({
                    '--network-background-color':
                      selectedNetwork.backgroundColor,
                    '--network-accent-color': selectedNetwork.textColor,
                    '--network-text-over-color': getReadableTextColor(selectedNetwork.backgroundColor),
                  } as React.CSSProperties)
                  : ({
                    '--network-background-color': 'grey',
                    '--network-accent-color': 'pink',
                    '--network-text-over-color': 'black',
                  } as React.CSSProperties)
              }
            >
              <CookiesBanner />
              <Alert />
              <div className="index__content">
                <ShowDesktopOnly>
                  <NavHeader
                    selectedNetwork={selectedNetwork}
                  />
                </ShowDesktopOnly>
                {authorized && <Component {...pageProps} />}
                {!authorized && <><Loading /></>}
                <NavBottomMobile sessionUser={sessionUser}/>
                <MainPopup/>
              </div>
            </div>
          </>
        );
      } else {
        return <><Loading /></>;
      }

    }).call(this)}
  </>
}

export const ClienteSideRendering = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return <>{isClient && children}</>;
};


function ActivityPool({ sessionUser }) {
  usePoolFindNewActivities({ timeMs: 30*1000, sessionUser })
  return (<></>);
}


const useWhichLocale = ({ sessionLocale, networkLocale }) => {

  const [_locale, set_Locale] = useState('en');

  useEffect(() => {
    const localeFromUrl = getLocaleFromUrl();
    if (localeFromUrl) {
      setLocale(localeFromUrl);
    } else if (sessionLocale && networkLocale) {
      setLocale(sessionLocale);
    } else if (networkLocale) {
      setLocale(networkLocale);
    }
    set_Locale((prevLocale) => {
      if (locale !== prevLocale && prevLocale && locale) {
        return locale;
      }
      return locale;
    });
  }, [networkLocale, sessionLocale]);
  return;
}

export const useIsSetup = (path) => {
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
  
    const setupPaths: string[] = [
      SetupSteps.CREATE_ADMIN_FORM,
      SetupSteps.FIRST_OPEN,
      SetupSteps.NETWORK_CREATION,
      SetupSteps.SETUP_LOGIN
    ];
  
    if (path && (setupPaths.includes(path) || path.startsWith('/LoginClick'))) {
      setIsSetup(() => true);
    } else {
      setIsSetup(() => false);
    }
  
  }, [path])
  
  return isSetup;
}