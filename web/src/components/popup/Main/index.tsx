import { Picker } from "components/picker/Picker";
import { GlobalState, store } from "state";
import { MainPopupPage, SetMainPopup, SetMainPopupCurrentButton, SetMainPopupCurrentProfile } from "state/HomeInfo";
import { useGlobalStore } from 'state';
import Login from "../../../pages/Login";
import Signup from "../../../pages/Signup";
import LoginClick from "../../../pages/LoginClick";
import t from "i18n";
import { ShareForm } from "components/share";
import { FaqSections } from "pages/Faqs";
import { ButtonShow } from "components/button/ButtonShow";
import router from "next/router";
import { useEffect } from "react";
import { ShowProfile } from "pages/p/[username]";

export default function MainPopup({pageName}) {
    const closePopup = () =>
      store.emit(new SetMainPopup(MainPopupPage.HIDE));

    const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
    const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage) 
    const mainPopupCurrentButton = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupCurrentButton) 
    const mainPopupUserProfile = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupUserProfile) 
    const allowedCurrentButton = ['HomeInfo', 'Activity']
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
        {(mainPopupUserProfile) && (
          <Picker
            headerText={t('user.otherProfileView')}
            closeAction={() => {closePopup(); store.emit(new SetMainPopupCurrentProfile(null))}}
          >
            <ShowProfile userProfile={mainPopupUserProfile} sessionUser={sessionUser}/>
          </Picker>
        )}
         {(mainPopupCurrentButton && allowedCurrentButton.indexOf(pageName) > -1 ) && (
          <Picker
            headerText={mainPopupCurrentButton.title}
            closeAction={() => {store.emit(new SetMainPopupCurrentButton(null)); router.back()}}
            extraClass={'picker__content--nopadding'}
          >
            {/* {pageName} */}
            <ButtonShow button={mainPopupCurrentButton}/>
          </Picker>
        )}
      </>
    );
  }