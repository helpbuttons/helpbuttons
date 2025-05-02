import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import t from "i18n";
import { useEffect, useState } from "react";
import { alertService } from "services/Alert";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import { GlobalState, useGlobalStore } from "state";
import { MainPopupPage } from "state/HomeInfo";

export default function CookiesBanner() {
    const [showCookiesBanner, setShowCookiesBanner] = useState(true);
    const mainPopup = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage) 
    useEffect(() => {
      const cookiesAccepted = localStorageService.read(LocalStorageVars.COOKIES_ACCEPTANCE);
      if (cookiesAccepted) {
        setShowCookiesBanner(() => false);
      }
    }, []);

    useEffect(() => {
        const cookiesAccepted = localStorageService.read(LocalStorageVars.COOKIES_ACCEPTANCE);
        if (cookiesAccepted) {
            return;
        }
        if([MainPopupPage.LOGIN, MainPopupPage.SIGNUP].indexOf(mainPopup) > -1)
        {
            alertService.info(t('user.pleaseAcceptCookies'))
            setShowCookiesBanner(() => true)
        }
    }, [mainPopup])
    const handleAcceptCookies = () => {
      localStorageService.save(LocalStorageVars.COOKIES_ACCEPTANCE, true);
      setShowCookiesBanner(() => false);
    };

    const handleRejectCookies = () => {
        setShowCookiesBanner(() => false);
    }
  
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