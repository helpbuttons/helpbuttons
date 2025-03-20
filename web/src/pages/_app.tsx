import '../styles/app.scss';
import { useState, useEffect, useRef } from 'react';
import { Router, useRouter } from 'next/router';
import NavBottom from 'components/nav/NavBottom'; //just for mobile
import Alert from 'components/overlay/Alert';
import { appWithTranslation } from 'next-i18next';
import { GlobalState, store } from 'state/';
import { useSelectedNetwork } from 'state/Networks';
import { FetchUserData, LoginToken } from 'state/Profile';

import { useGlobalStore } from 'state';
import { alertService } from 'services/Alert';
import { SetupSteps } from '../shared/setupSteps';

import { Role } from 'shared/types/roles';
import {
  getHref,
  getLocale,
  getLocaleFromUrl,
  isRoleAllowed,
  locale,
  setLocale,
} from 'shared/sys.helper';
import t, { updateNomeclature } from 'i18n';
import { useSearchParams } from 'next/navigation';
import NavHeader from 'components/nav/NavHeader';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import { MetadataSEO } from 'components/seo';
import Loading, { LoadabledComponent } from 'components/loading';
import MainPopup from 'components/popup/Main/';
import { useConfig } from 'state/Setup';
import { UpdateMetadata } from 'state/Metadata';
import { usePoolFindNewActivities } from 'state/Activity';
import { randomBytes } from 'crypto'
import MetadataSEOFromStore from 'components/seo';
import { useRebuildUrl } from 'components/uri/builder';
import { LocalStorageVars, localStorageService } from 'services/LocalStorage';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';

export default appWithTranslation(MyApp);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(null);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [fetchingNetworkError, setFetchingNetworkError] = useState(false)
  const path = router.asPath.split('?')[0];
  const nonce = randomBytes(128).toString('base64')
  useRebuildUrl(router);
  const messagesUnread = useGlobalStore(
    (state: GlobalState) => state.activities.messages.unread
  );

  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser)
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
  const [pageName, setPageName] = useState('HomeInfo')
  useEffect(() => {
    setPageName(getPageName(path.split('/')[1]))

    function getPageName(urlString) {
      const finit = urlString.indexOf("#") !== -1 ? urlString.indexOf("#") : (urlString.indexOf("?") !== -1 ? urlString.indexOf("?") !== -1 : null)
      if (finit) {
        return urlString.substr(0, finit)
      }
      return urlString;
    }
  }, [path])



  const config = useConfig(pageProps._config, onFetchingConfigError);
  const selectedNetwork = useSelectedNetwork(
    pageProps._selectedNetwork
  );
  const setupPaths: string[] = [
    SetupSteps.CREATE_ADMIN_FORM,
    SetupSteps.FIRST_OPEN,
    SetupSteps.NETWORK_CREATION,
  ];
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
    }
  }, [fetchingNetworkError, sessionUser])

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
      !sessionUser
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
      setAuthorized(true);
      return;
    }

    // check if local storage has a token
    if (sessionUser === false) {
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
      alertService.error(
        `You are not allowed in here!`
      );
      router.push('/Error')
      return;
    }
    setAuthorized(isAllowed);

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
  } else if (!selectedNetwork.initialized) {
    return (
      <>
        <MetadataSEOFromStore {...pageProps.metadata} nonce={nonce} />
        <ActivityPool sessionUser={sessionUser} messagesUnread={messagesUnread} />
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
          <CookiesBanner/>
          <Alert />
          <div className="index__content">
            <ShowDesktopOnly>
              <NavHeader
                pageName={pageName}
                selectedNetwork={selectedNetwork}
              />
            </ShowDesktopOnly>
            {authorized && <Component {...pageProps} />}
            {!authorized && <><Loading /></>}
            <ShowMobileOnly>
              <ClienteSideRendering>
                <NavBottom
                  pageName={pageName}
                  sessionUser={sessionUser}
                />
              </ClienteSideRendering>
            </ShowMobileOnly>
            <MainPopup pageName={pageName} />
          </div>
        </div>
      </>
    );
  }

  return <><MetadataSEO {...pageProps.metadata} nonce={nonce} /><Loading /></>;
}

export const ClienteSideRendering = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return <>{isClient && children}</>;
};


function ActivityPool({ sessionUser, messagesUnread }) {
  usePoolFindNewActivities({ timeMs: 10000, sessionUser, messagesUnread })

  return (<></>);
}

export function CookiesBanner() {
  const [showCookiesBanner, setShowCookiesBanner] = useState(false);
  useEffect(() => {
    const cookiesAccepted = localStorageService.read(LocalStorageVars.COOKIES_ACCEPTANCE);
    if (!cookiesAccepted) {
      setShowCookiesBanner(true);
    }
  }, []);
  const handleAcceptCookies = () => {
    localStorageService.save(LocalStorageVars.COOKIES_ACCEPTANCE, true);
    setShowCookiesBanner(false);
  };

  return (
    <>{showCookiesBanner &&
    <div className="card-alert__container">
      <div className="cookies-banner__content">
        <p>
        {t('faqs.cookiesExplanation')}
          <a href="/Faqs" target="_blank" rel="noopener noreferrer">
          {t('faqs.cookiesPolicy')}
          </a>
          .
        </p>
        <Btn
            btnType={BtnType.submit}
            iconLeft={IconType.circle}
            caption={t('faqs.cookieAccept')}
            contentAlignment={ContentAlignment.center}
            onClick={handleAcceptCookies}
          />
      </div>
    </div>
    }</>
  );
}

const useWhichLocale = ({ sessionLocale, networkLocale }) => {

  const [_locale, set_Locale] = useState('en');

  useEffect(() => {
    const localeFromUrl = getLocaleFromUrl();
    if (localeFromUrl) {
      console.log('set from url')
      setLocale(localeFromUrl);
    } else if (sessionLocale && networkLocale) {
      console.log('set user session')
      setLocale(sessionLocale);
    } else if (networkLocale) {
      console.log('set from network')
      setLocale(networkLocale);
    }
    set_Locale((prevLocale) => {
      console.log(locale + ' > ' + prevLocale)
      if (locale !== prevLocale && prevLocale && locale) {
        return locale;
      }
      return locale;
    });
  }, [networkLocale, sessionLocale]);
  return;
}
