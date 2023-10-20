//Users buttons an profile info URL
import CardProfile, {
  LinkAdminButton,
} from 'components/user/CardProfile';

import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindAdminButton, FindUser, Logout } from 'state/Users';
import { UserService } from 'services/Users';
import { Role } from 'shared/types/roles';

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
  const username = router.query.username as string;
  useEffect(() => {
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
  }, [userProfile]);

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.username == username) {
        router.push('/Profile');
      }
    }
  }, [loggedInUser]);
  return (
    <>
      <div className="body__content">
        <div className="card-profile__container">
          {userProfile && <CardProfile user={userProfile} showAdminOptions={userProfile.role == Role.admin}/>}
          {userProfile?.role == Role.admin && adminButtonId && (
            <LinkAdminButton adminButtonId={adminButtonId} />
          )}
        </div>
      </div>
    </>
  );
}
