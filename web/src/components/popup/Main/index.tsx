import { Picker } from "components/picker/Picker";
import { GlobalState, store } from "state";
import { MainPopupPage, SetMainPopup, SetMainPopupCurrentButton, SetMainPopupCurrentProfile } from "state/HomeInfo";
import { useGlobalStore } from 'state';
import { SignupAsGuestForm, SignupForm } from "../../../pages/Signup";
import LoginClick from "../../../pages/LoginClick";
import t from "i18n";
import { ShareForm } from "components/share";
import { FaqSections } from "pages/Faqs";
import { ButtonShow } from "components/button/ButtonShow";
import { ShowProfile } from "pages/p/[username]";
import { useEffect } from "react";
import { replaceUrl, usePreviousUrl } from "components/uri/builder";
import LoginForm from "components/user/LoginForm";
import { InviteForm, InviteScan } from "pages/Signup/Invite";
import { useIsMobile } from "elements/SizeOnly";

export default function MainPopup() {
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)

  const previousUrl = usePreviousUrl();
  const closePopup = () => {
    replaceUrl(previousUrl)
    store.emit(new SetMainPopup(MainPopupPage.HIDE));
  }

  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
  const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage)
  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)
  const mainPopupUserProfile = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupUserProfile)
  const mainPopupButton = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupButton)
  const isMobile = useIsMobile()

  useReplaceUrl(mainPopupUserProfile, mainPopupButton, popupPage, currentButton)
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
      {(popupPage == MainPopupPage.SIGNUP_AS_GUEST) && (
          <Picker
            headerText={t('user.signup')}
            closeAction={closePopup}
          >
            <SignupAsGuestForm />
          </Picker>
      )}
      {popupPage == MainPopupPage.INVITE && (
        <Picker
          headerText={t('user.signup')}
          closeAction={closePopup}
        >
          <InviteForm />
        </Picker>
      )}
      {popupPage == MainPopupPage.INVITE_SCAN && (
        <Picker
          headerText={t('user.signup')}
          closeAction={closePopup}
        >
        <InviteScan />
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
      {mainPopupButton && (pageName != 'Activity' || isMobile) && (
        <Picker
          headerText={null}
          closeAction={() => { store.emit(new SetMainPopupCurrentButton(null)); closePopup() }}
          extraClass={'picker__content--nopadding'}
        >
          <ButtonShow button={currentButton} />
        </Picker>
      )}
    </>
  );
}


function useReplaceUrl(mainPopupUserProfile, mainPopupButton, popupPage, currentButton) {
  useEffect(() => {
    if (mainPopupUserProfile) {
      replaceUrl(`/p/${mainPopupUserProfile.username}`);
    }

  }, [mainPopupUserProfile]);

  useEffect(() => {
    if (mainPopupButton) {
      replaceUrl(`/Show/${currentButton?.id}`);
    }
  }, [mainPopupButton])

  useEffect(() => {
    if (popupPage != MainPopupPage.HIDE) {
      switch (popupPage) {
        case MainPopupPage.FAQS:
          replaceUrl(`/Faqs`);
          break;
        case MainPopupPage.LOGIN:
          replaceUrl(`/Login`);
          break;
        case MainPopupPage.SIGNUP:
          replaceUrl(`/Signup`);
          break;
        case MainPopupPage.INVITE:
          replaceUrl('/Signup/Invite')
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

export function SetupMainPopup() {
  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);

  const previousUrl = usePreviousUrl();

  const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage)

  const closePopup = () => {
    replaceUrl(previousUrl)
    store.emit(new SetMainPopup(MainPopupPage.HIDE));
  }

  return <OnlyGuest sessionUser={sessionUser}>{popupPage == MainPopupPage.REQUEST_LINK && (
    <Picker closeAction={closePopup} headerText={null}>
      <LoginClick />
    </Picker>
  )}</OnlyGuest>
}