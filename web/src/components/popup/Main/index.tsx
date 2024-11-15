import { Picker } from "components/picker/Picker";
import { GlobalState, store } from "pages";
import { MainPopupPage, SetMainPopup } from "state/HomeInfo";
import { useGlobalStore } from "store/Store";
import Login from "../../../pages/Login";
import Signup from "../../../pages/Signup";
import LoginClick from "../../../pages/LoginClick";
import t from "i18n";
import { ShareForm } from "components/share";
import { FaqSections } from "pages/Faqs";
import { ButtonShow } from "components/button/ButtonShow";
import { setActivityCurrentButton, updateCurrentButton } from "state/Explore";
import router from "next/router";
import { useEffect } from "react";

export default function MainPopup({pageName}) {
    const closePopup = () =>
      store.emit(new SetMainPopup(MainPopupPage.HIDE));
    const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage) 
    const activityCurrentButton = useGlobalStore(
      (state: GlobalState) => state.explore.activityCurrentButton,
    );
    const allowedPages =  ["Activity"]
    return (
      <>
        {popupPage == MainPopupPage.LOGIN && (
          <Picker closeAction={closePopup} headerText={t('user.login')}>
            <Login />
          </Picker>
        )}
        {popupPage == MainPopupPage.SIGNUP && (
          <Picker
            headerText={t('user.signup')}
            closeAction={closePopup}
          >
            <Signup />
          </Picker>
        )}
        {popupPage == MainPopupPage.REQUEST_LINK && (
          <Picker closeAction={closePopup} headerText={null}>
            <LoginClick />
          </Picker>
        )}
        {popupPage == MainPopupPage.SHARE && (
          <Picker
            headerText={t('share.header')}
            closeAction={closePopup}
          >
            <ShareForm/>
          </Picker>
        )}
        {popupPage == MainPopupPage.FAQS && (
          <Picker
            headerText={t('faqs.title')}
            closeAction={closePopup}
          >
            <FaqSections/>
          </Picker>
        )}
         {(activityCurrentButton && pageName.indexOf(allowedPages) > -1) && (
          <Picker
            headerText={activityCurrentButton.title}
            closeAction={() => {store.emit(new setActivityCurrentButton(null)); router.back()}}
            extraClass={'picker__content--nopadding'}
          >
            {/* {pageName} */}
            <ButtonShow button={activityCurrentButton}/>
          </Picker>
        )}
      </>
    );
  }