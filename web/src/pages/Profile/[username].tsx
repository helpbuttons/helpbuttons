//Users buttons an profile info URL
import CardProfile, {
  LinkAdminButton,
} from 'components/user/CardProfile';

import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindAdminButton, FindUser, Logout } from 'state/Users';
import { UserService } from 'services/Users';
import { Role } from 'shared/types/roles';
import { useRouter } from 'next/router';
import Popup from 'components/popup/Popup';
import t from 'i18n';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const knownUsers = useRef(
    store,
    (state: GlobalState) => state.knownUsers,
  );
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const [adminButtonId, setAdminButtonId] = useState(null);

  function logout() {
    UserService.logout();
  }

  const removeProfile = () => {
    console.log('remove myself!');
  };
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

  return (
    <>
          <Popup linkFwd="/Explore" title={t('user.otherProfileView')}>
            {userProfile && <CardProfile user={userProfile} showAdminOptions={userProfile.role == Role.admin}/>}
            {userProfile?.role == Role.admin && adminButtonId && (
              <LinkAdminButton adminButtonId={adminButtonId} />
            )}
          </Popup>
    </>
  );
}
