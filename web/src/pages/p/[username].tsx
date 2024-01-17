//Users buttons an profile info URL
import CardProfile, {
  LinkAdminButton,
} from 'components/user/CardProfile';

import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindAdminButton, FindExtraFieldsUser, FindUserButtons } from 'state/Users';
import { UserService } from 'services/Users';
import { Role } from 'shared/types/roles';
import { useRouter } from 'next/router';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import ContentList from 'components/list/ContentList';
import { useButtonTypes } from 'shared/buttonTypes';
import { useScrollHeight } from 'elements/scroll';
import { NextPageContext } from 'next';
import { ServerPropsService } from 'services/ServerProps';
import { HttpStatus } from 'shared/types/http-status.enum';
import { makeImageUrl } from 'shared/sys.helper';
import SEO from 'components/seo';

export default function p({metadata, userProfile}) {
  const [userButtons,setUserButtons] = useState([])
  const [extraFields,setExtraFields] = useState([])
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
    if(!router.isReady) return;
    const username = router.query.username as string;
    let newUserProfile = '';
    if (userProfile) {
      if (userProfile.role == Role.admin) {
        store.emit(
          new FindAdminButton((buttonData) => {
            if (buttonData?.id) {
              setAdminButtonId(() => buttonData.id);
            }
          }),
        );
      }
      if(!userButtons)
      {
        store.emit(new FindUserButtons(userProfile.id, (userButtons) => setUserButtons(userButtons)))
      }
      // if user is admin... get more data!
      if(loggedInUser?.role == Role.admin)
      {
        store.emit(new FindExtraFieldsUser(userProfile.id, (extraFields) => {
          setExtraFields(extraFields)
        }, () => {}))
      }
      // store.emit(FindExtraFieldsUser(userProfile.id))
    }
    if (loggedInUser) {
      if (loggedInUser.username == username) {
        router.push('/Profile');
      }
    }
  }, [userProfile, loggedInUser, router.isReady]);

  const [buttonTypes, setButtonTypes] = useState([]);
  useButtonTypes(setButtonTypes);

  const {sliceSize, handleScrollHeight} = useScrollHeight(userButtons.length)
  
  return (
    <>
          <SEO {...metadata} />
          <Popup linkFwd="/Explore" title={t('user.otherProfileView')} onScroll={handleScrollHeight}>
            {userProfile && <CardProfile user={userProfile} showAdminOptions={loggedInUser?.role == Role.admin}/>}
            {userProfile?.role == Role.admin && adminButtonId && (
              <LinkAdminButton adminButtonId={adminButtonId} />
            )}
            {loggedInUser?.role == Role.admin &&
              <>Email: {extraFields.email}</>
            }
            {(userButtons && userButtons.length > 0)&& 
            <div className='card-profile__button-list'>
              <ContentList buttons={userButtons.slice(0, sliceSize)} buttonTypes={buttonTypes} linkToPopup={false}/>
            </div>}
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
  if(currentUserData?.statusCode == HttpStatus.NOT_FOUND)
  {
    return {props: serverProps};
  }
  const serverPropsModified = {
    ...serverProps,
    metadata: {
      ...serverProps.metadata,
      title: `${currentUserData.username} - ${serverProps.selectedNetwork.name}`,
      description: currentUserData.description,
      image: `${makeImageUrl(
        currentUserData.avatar,
        serverProps.config.hostName + '/api',
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
