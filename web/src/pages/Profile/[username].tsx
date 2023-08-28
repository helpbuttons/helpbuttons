//Users buttons an profile info URL
import CardProfile from 'components/user/CardProfile';

import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindUser, Logout } from 'state/Users';
import Link from 'next/link';
import { IoAlarm, IoHammerOutline, IoLogOutOutline } from 'react-icons/io5';
import Btn, { IconType } from 'elements/Btn';
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

  function logout() {
    UserService.logout();
  }

  const removeProfile = () => {
    console.log('remove myself!')
  }
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
  }, [userProfile]);

  useEffect(() => {
    if(loggedInUser){
      if(loggedInUser.username == username)
      {
        router.push('/Profile')
      }
    }
  },[loggedInUser])
  return (
    <>
      <div className="body__content">
        <div className="body__section">
          <div className="card-profile__container">
            {userProfile && (
                <CardProfile user={userProfile} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
