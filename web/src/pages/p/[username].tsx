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

export default function p(props) {
  const sessionUser = useRef(
    store,
    (state: GlobalState) => state.sessionUser,
  );
  const { userProfile } = props;

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const username = router.query.username as string;
    let newUserProfile = '';

    if (sessionUser) {
      if (sessionUser.username == username) {
        router.push('/Profile');
      }
    }
  }, [userProfile, sessionUser, router.isReady]);
  const closeAction = () => router.back();
  return (
    <Popup
      linkBack={closeAction}
      title={t('user.otherProfileView')}
      onScroll={() => {}}
    >
      <ShowProfile
        userProfile={userProfile}
        sessionUser={sessionUser}
      />
    </Popup>
  );
}

export function ShowProfile({
  userProfile,
  sessionUser,
}) {
  const [userButtons, setUserButtons] = useState(null);

  const [extraFields, setExtraFields] = useState([]);
  useEffect(() => {
    // if user is admin... get more data!
    if (userProfile) {
      if (userProfile.showButtons && !userButtons) {
        console.log('getting user btns');
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
    // store.emit(FindExtraFieldsUser(userProfile.id))
  }, []);

  useEffect(() => {
    if(userProfile)
    {
      window.history.replaceState(null, '', `/p/${userProfile.username}`);
    }
    
  }, [userProfile]);

  const knownUsers = useRef(
    store,
    (state: GlobalState) => state.knownUsers,
  );

  useMetadataTitle(t('menu.profile'));

  const [adminButtonId, setAdminButtonId] = useState(null);

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
              linkToPopup={false}
            />
          </div>
        )}
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.profile'), ctx);
};
