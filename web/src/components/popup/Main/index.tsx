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
import { updateCurrentButton } from "state/Explore";
import router from "next/router";

export default function MainPopup({pageName}) {
    const closePopup = () =>
      store.emit(new SetMainPopup(MainPopupPage.HIDE));
    const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage) 
    const currentButton = useGlobalStore(
      (state: GlobalState) => state.explore.currentButton,
    );
    
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
         {(currentButton && pageName != 'Explore') && (
          <Picker
            headerText={currentButton.title}
            closeAction={() => {store.emit(new updateCurrentButton(null)); router.back()}}
          >
            {pageName}
            <ButtonShow/>
          </Picker>
        )}
      </>
    );
  }