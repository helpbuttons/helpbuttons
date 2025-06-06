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

  useEffect(() => {
    const cookieState = localStorageService.read(LocalStorageVars.COOKIES_ACCEPTANCE) as CookiesState 
    store.emit(new SetCookieState(cookieState ? cookieState : CookiesState.UNREAD))
  }, [])
  
  const handleAcceptCookies = () => {
    localStorageService.save(LocalStorageVars.COOKIES_ACCEPTANCE, CookiesState.ACCEPTED)
    store.emit(new SetCookieState(CookiesState.ACCEPTED))
  };

  const handleRejectCookies = () => {
    localStorageService.save(LocalStorageVars.COOKIES_ACCEPTANCE, CookiesState.REJECTED)
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



export function cookiesAreAccepted() {

  const acceptedCookies = localStorageService.read(LocalStorageVars.COOKIES_ACCEPTANCE)
  if (acceptedCookies != CookiesState.ACCEPTED) {
    store.emit(new SetCookieState(CookiesState.UNREAD))
    alertService.info(t('user.pleaseAcceptCookies'))
    return false;
  }

  return true;

}