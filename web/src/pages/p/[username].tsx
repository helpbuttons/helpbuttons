//Users buttons an profile info URL
import { useRef } from 'store/Store';
import { GlobalState, store } from 'state';
import { useEffect, useState } from 'react';
import { FindUserButtons } from 'state/Users';
import { FindExtraFieldsUser } from 'state/Profile';

import { Role } from 'shared/types/roles';
import router, { useRouter } from 'next/router';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import { useButtonTypes } from 'shared/buttonTypes';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import CardProfile from 'components/user/CardProfile';
import ContentList from 'components/list/ContentList';
import { useMetadataTitle } from 'state/Metadata';
import dconsole from 'shared/debugger';
import { ButtonLinkType } from 'components/list/CardButtonList';
import { SetMainPopupCurrentProfile } from 'state/HomeInfo';
import HomeInfo from 'pages/HomeInfo';

export default function p(props) {
  useMetadataTitle(t('menu.login'))
  const { userProfile } = props;
  useEffect(() => {
      // store.emit(new SetMainPopup(MainPopupPage.LOGIN))
      store.emit(new SetMainPopupCurrentProfile(userProfile))
  }, [])
  
  return (

          <HomeInfo metadata={props.metadata}/>
  );
}

export function ShowProfile({
  userProfile,
  sessionUser,
}) {
  const [userButtons, setUserButtons] = useState(null);

  const [extraFields, setExtraFields] = useState([]);
  useEffect(() => {
    console.log(userProfile)
    if (userProfile) {
      if (userProfile.showButtons) {
        dconsole.log('getting user btns');
        store.emit(
          new FindUserButtons(userProfile.id, (userButtons) =>
            setUserButtons(userButtons),
          ),
        );
      }

      if (sessionUser?.role == Role.admin) {
        store.emit(
          new FindExtraFieldsUser(
            userProfile.id,
            (extraFields) => {
              setExtraFields(extraFields);
            },
            () => {},
          ),
        );
      }
    }
  }, [userProfile]);



  useMetadataTitle(t('menu.profile'));

  const buttonTypes = useButtonTypes();

  return (
    <>
      {userProfile && (
        <CardProfile
          user={userProfile}
          showAdminOptions={sessionUser?.role == Role.admin}
        />
      )}
      {userProfile?.showButtons &&
        userButtons &&
        userButtons?.length > 0 && (
          <div className="card-profile__button-list">
            <ContentList
              buttons={userButtons}
              buttonTypes={buttonTypes}
              linkType={ButtonLinkType.MAINPOPUP}
            />
          </div>
        )}
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.profile'), ctx);
};
