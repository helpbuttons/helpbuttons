//Users buttons an profile info URL
import CardProfile, {
  LinkAdminButton,
} from 'components/user/CardProfile';

import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindAdminButton, FindUser, FindUserButtons, Logout } from 'state/Users';
import { UserService } from 'services/Users';
import { Role } from 'shared/types/roles';
import { useRouter } from 'next/router';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import ContentList from 'components/list/ContentList';
import { useButtonTypes } from 'shared/buttonTypes';
import { useScrollHeight } from 'elements/scroll';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userButtons,setUserButtons] = useState([])
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
    if (!userProfile) {
      if (knownUsers) {
        newUserProfile = knownUsers.filter((user: User) => {
          return user?.username == username;
        });
      }
      if (newUserProfile.length > 0) {
        setUserProfile(newUserProfile[0]);
      } else {
        store.emit(
          new FindUser(username, (user) => {
            setUserProfile(user);
            store.emit(new FindUserButtons(user.id, (userButtons) => setUserButtons(userButtons)))
          }),
        );
      }
    }
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
          <Popup linkFwd="/Explore" title={t('user.otherProfileView')} onScroll={handleScrollHeight}>
            {userProfile && <CardProfile user={userProfile} showAdminOptions={loggedInUser?.role == Role.admin}/>}
            {userProfile?.role == Role.admin && adminButtonId && (
              <LinkAdminButton adminButtonId={adminButtonId} />
            )}
            {userButtons && 
            <>
              <ContentList buttons={userButtons.slice(0, sliceSize)} buttonTypes={buttonTypes}/>
            </>}
          </Popup>
    </>
  );
}
