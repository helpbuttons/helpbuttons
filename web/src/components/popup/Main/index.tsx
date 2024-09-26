import { Picker } from "components/picker/Picker";
import { GlobalState, store } from "pages";
import { MainPopupPage, SetMainPopup } from "state/HomeInfo";
import { useGlobalStore } from "store/Store";
import Login from "../../../pages/Login";
import Signup from "../../../pages/Signup";
import LoginClick from "../../../pages/LoginClick";
import t from "i18n";
import { ShareForm } from "components/share";

export default function MainPopup() {
    const closePopup = () =>
      store.emit(new SetMainPopup(MainPopupPage.HIDE));
    const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage) 
  
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
      </>
    );
  }