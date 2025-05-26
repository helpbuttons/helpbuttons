import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import t from "i18n";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { alertService } from "services/Alert";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import { GlobalState, store, useGlobalStore } from "state";
import { CookiesState, SetCookieState, SetMainPopup } from "state/HomeInfo";

export default function CookiesBanner() {

  const cookiesState = useGlobalStore((state: GlobalState) => state.homeInfo.cookiesState) 
  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser)  

  /**  make sure that cookies are set as accepted if user is logged in*/
  useEffect(() => {
    if(sessionUser)
    {
      localStorageService.save(LocalStorageVars.COOKIES_ACCEPTANCE, true)
    }
  },[sessionUser])
  
  const handleAcceptCookies = () => {
    store.emit(new SetCookieState(CookiesState.ACCEPTED))
  };

  const handleRejectCookies = () => {
    store.emit(new SetCookieState(CookiesState.REJECTED))
  }

  return (
    <>{(cookiesState == CookiesState.UNREAD )&&
      <div className="card-alert__container">
        <div className="cookies-banner__content">
          <p>
            {t('faqs.cookiesExplanation')}
            <a href="/Faqs" target="_blank" rel="noopener noreferrer">
              {t('faqs.cookiesPolicy')}
            </a>
            .
          </p>
          <div className="cookies-banner__buttons">
            <Btn
              btnType={BtnType.submit}
              iconLeft={IconType.circle}
              caption={t('faqs.cookieAccept')}
              contentAlignment={ContentAlignment.center}
              onClick={handleAcceptCookies}
            />
            <Btn
              btnType={BtnType.submit}
              iconLeft={IconType.circle}
              caption={t('faqs.cookieReject')}
              contentAlignment={ContentAlignment.center}
              onClick={handleRejectCookies}
            />
          </div>
        </div>
      </div>
    }</>
  );
}

export function requireAcceptedCookies(pagesRequiringCookies) {
  const router = useRouter()
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)
  const mainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage)

  useEffect(() => {
    console.log(pagesRequiringCookies)
    console.log(pageName)
    console.log(mainPopupPage)
    const pageRequiresCookies = pagesRequiringCookies.indexOf(pageName) > -1 
    const popupRequiresCookies = pagesRequiringCookies.indexOf(mainPopupPage) > -1
    if (pageRequiresCookies|| popupRequiresCookies) {
      const acceptedCookies = localStorageService.read(LocalStorageVars.COOKIES_ACCEPTANCE)
      if (acceptedCookies != CookiesState.ACCEPTED) {
        store.emit(new SetCookieState(CookiesState.UNREAD))
        alertService.info(t('user.pleaseAcceptCookies'))
        if(popupRequiresCookies)
        {
          store.emit(new SetMainPopup(null))
        }
        if(pageRequiresCookies)
        {
          router.push('/HomeInfo')
        }
      }
    }

  }, [pageName, mainPopupPage])
}