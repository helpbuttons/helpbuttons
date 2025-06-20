import { Picker } from "components/picker/Picker";
import { GlobalState, store } from "state";
import { MainPopupPage, SetMainPopup, SetMainPopupCurrentButton, SetMainPopupCurrentProfile } from "state/HomeInfo";
import { useGlobalStore } from 'state';
import { SignupForm } from "../../../pages/Signup";
import LoginClick from "../../../pages/LoginClick";
import t from "i18n";
import { ShareForm } from "components/share";
import { FaqSections } from "pages/Faqs";
import { ButtonShow } from "components/button/ButtonShow";
import { ShowProfile } from "pages/p/[username]";
import { useEffect } from "react";
import { replaceUrl, usePreviousUrl } from "components/uri/builder";
import LoginForm from "components/user/LoginForm";
import { useRouter } from "next/router";

export default function MainPopup() {
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)
  const router = useRouter()
  const previousUrl = usePreviousUrl();
  const closePopup = () => {
    router.replace(`${previousUrl}`)
    store.emit(new SetMainPopup(MainPopupPage.HIDE));
  }

  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
  const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage)
  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)
  const mainPopupUserProfile = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupUserProfile)
  const mainPopupButton = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupButton)

  useReplaceUrl(mainPopupUserProfile, mainPopupButton, popupPage)
  return (
    <>
      <OnlyGuest sessionUser={sessionUser}>
        {(popupPage == MainPopupPage.LOGIN) && (
          <Picker closeAction={closePopup} headerText={t('user.login')}>
            <LoginForm />
          </Picker>
        )}
        {(popupPage == MainPopupPage.SIGNUP) && (
          <Picker
            headerText={t('user.signup')}
            closeAction={closePopup}
          >
            <SignupForm />
          </Picker>
        )}
        {popupPage == MainPopupPage.REQUEST_LINK && (
          <Picker closeAction={closePopup} headerText={null}>
            <LoginClick />
          </Picker>
        )}
      </OnlyGuest>

      {popupPage == MainPopupPage.SHARE && (
        <Picker
          headerText={t('share.header')}
          closeAction={closePopup}
        >
          <ShareForm />
        </Picker>
      )}
      {popupPage == MainPopupPage.FAQS && (
        <Picker
          headerText={t('faqs.title')}
          closeAction={closePopup}
        >
          <FaqSections />
        </Picker>
      )}
      {(mainPopupUserProfile) && (
        <Picker
          headerText={t('user.otherProfileView')}
          closeAction={() => { store.emit(new SetMainPopupCurrentProfile(null)); closePopup() }}
        >
          <ShowProfile userProfile={mainPopupUserProfile} sessionUser={sessionUser} />
        </Picker>
      )}
      {mainPopupButton && (
        <Picker
          headerText={mainPopupButton.title}
          closeAction={() => { store.emit(new SetMainPopupCurrentButton(null)); closePopup() }}
          extraClass={'picker__content--nopadding'}
        >
          <ButtonShow button={mainPopupButton} />
        </Picker>
      )}
    </>
  );
}


function useReplaceUrl(mainPopupUserProfile, mainPopupButton, popupPage) {
  const router = useRouter()

  useEffect(() => {
    if (mainPopupUserProfile) {
      router.replace(`/p/${mainPopupUserProfile.username}`);
    }

  }, [mainPopupUserProfile]);

  useEffect(() => {
    if (mainPopupButton) {
      router.replace(`/Show/${mainPopupButton.id}`);
    }
  }, [mainPopupButton])

  useEffect(() => {
    if (popupPage != MainPopupPage.HIDE) {
      switch (popupPage) {
        case MainPopupPage.FAQS:
          router.replace(`/Faqs`);
          break;
        case MainPopupPage.LOGIN:
          router.replace(`/Login`);
          break;
        case MainPopupPage.SIGNUP:
          router.replace(`/Signup`);
          break;
        case MainPopupPage.PROFILE:
        case MainPopupPage.SHARE:
        case MainPopupPage.REQUEST_LINK:
      }
    }
  }, [popupPage])

}

function OnlyGuest({ sessionUser, children }) {
  if (sessionUser) {
    return <></>
  }
  return children
}