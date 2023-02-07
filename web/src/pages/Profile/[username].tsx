//Users buttons an profile info URL
import NavHeader from 'components/nav/NavHeader';
import CardProfile from 'components/user/CardProfile';
import DynForm from 'elements/DynForm';

import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindUser, Logout } from 'state/Users';
import Link from 'next/link';
import { IoHammerOutline, IoLogOutOutline } from 'react-icons/io5';
import Btn, { IconType } from 'elements/Btn';
import { UserService } from 'services/Users';

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
    store.emit(new Logout());
    UserService.logout();
  }


  const username = router.query.username as string;
  useEffect(() => {
    if (knownUsers) {
      const newUserProfile = knownUsers.filter((user: User) => {
        return user.username == username;
      });
      if (newUserProfile.length > 0) {
        console.log('found user profile');
        console.log(newUserProfile);
        setUserProfile(newUserProfile[0]);
      } else {
        // console.log('getting unknown user')
        store.emit(
          new FindUser(username, (user) => {
            setUserProfile(user);
          }),
        );
      }
    }
  }, [knownUsers]);
  return (
    <>
      <div className="body__content">
        <div className="body__section">
          {userProfile && <CardProfile user={userProfile} />}

          {userProfile?.username == loggedInUser?.username && (
            <div className="card-profile__actions">
              <Link href="/Explore">
                <div onClick={logout} className="btn-with-icon">
                  <div className="btn-with-icon__icon">
                    <IoLogOutOutline />
                  </div>
                  <span className="btn-with-icon__text">Logout</span>
                </div>
              </Link>

              <Link href="/Config">
                <Btn
                  iconLeft={IconType.svg}
                  iconLink={<IoHammerOutline />}
                  caption="Config account"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
