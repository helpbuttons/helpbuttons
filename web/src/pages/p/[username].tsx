//Users buttons an profile info URL
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import {
  FindExtraFieldsUser,
  FindUserButtons,
} from 'state/Users';
import { Role } from 'shared/types/roles';
import { useRouter } from 'next/router';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import { useButtonTypes } from 'shared/buttonTypes';
import { NextPageContext } from 'next';
import { ServerPropsService } from 'services/ServerProps';
import { HttpStatus } from 'shared/types/http-status.enum';
import { makeImageUrl } from 'shared/sys.helper';
import CardProfile from 'components/user/CardProfile';
import ContentList from 'components/list/ContentList';

export default function p({ metadata, userProfile }) {
  const [userButtons, setUserButtons] = useState(null);
  const [extraFields, setExtraFields] = useState([]);
  const knownUsers = useRef(
    store,
    (state: GlobalState) => state.knownUsers,
  );
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const [adminButtonId, setAdminButtonId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const username = router.query.username as string;
    let newUserProfile = '';
    if (userProfile) {
      if (userProfile.showButtons && !userButtons) {
        console.log('getting user btns');
        store.emit(
          new FindUserButtons(userProfile.id, (userButtons) =>
            setUserButtons(userButtons),
          ),
        );
      }
      // if user is admin... get more data!
      if (loggedInUser?.role == Role.admin) {
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
      // store.emit(FindExtraFieldsUser(userProfile.id))
    }
    if (loggedInUser) {
      if (loggedInUser.username == username) {
        router.push('/Profile');
      }
    }
  }, [userProfile, loggedInUser, router.isReady]);

  const buttonTypes = useButtonTypes();

  return (
    <>
      <Popup
        linkFwd="/Explore"
        title={t('user.otherProfileView')}
        onScroll={() => {}}
      >
        {userProfile && (
          <CardProfile
            user={userProfile}
            showAdminOptions={loggedInUser?.role == Role.admin}
          />
        )}
        {loggedInUser?.role == Role.admin && (
          <>Email: {extraFields.email}</>
        )}
        {userProfile.showButtons &&
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
      </Popup>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const serverProps = await ServerPropsService.general(
    'New Button',
    ctx,
  );
  const profileUrl = `${process.env.API_URL}/users/find/${ctx.params.username}`;
  const userProfileFetch = await fetch(profileUrl, {
    next: { revalidate: 10 },
  });
  const currentUserData = await userProfileFetch.json();
  if (currentUserData?.statusCode == HttpStatus.NOT_FOUND) {
    return { props: serverProps };
  }
  const serverPropsModified = {
    ...serverProps,
    metadata: {
      ...serverProps.metadata,
      title: `${currentUserData.username} - ${serverProps.selectedNetwork.name}`,
      description: currentUserData.description,
      image: `${makeImageUrl(
        currentUserData.avatar
      )}`,
    },
  };

  return {
    props: {
      ...serverPropsModified,
      userProfile: await currentUserData,
    },
  };
};
