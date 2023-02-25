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

  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  function logout() {
    UserService.logout();
    router.push("/HomeInfo")
  }

  const removeProfile = () => {
    console.log('remove myself!')
  }

  return (
    <>
      <div className="body__content">
        <div className="body__section">
          <div className="card-profile__container">
            {loggedInUser && (
              <>
                <CardProfile user={loggedInUser} />
              </>
            )}

            <Link href="/ProfileEdit">
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoHammerOutline />}
                caption="Edit profile"
              />
            </Link>
            {loggedInUser?.username == loggedInUser?.username && (
              <div className="card-profile__actions">
                <Link href="/Explore">
                  <div onClick={logout} className="btn-with-icon">
                    <div className="btn-with-icon__icon">
                      <IoLogOutOutline />
                    </div>
                    <span className="btn-with-icon__text">
                      Logout
                    </span>
                  </div>
                </Link>

                {loggedInUser?.role == Role.admin && (
                  <div>
                    <Link href="/Configuration">
                      <Btn
                        iconLeft={IconType.svg}
                        iconLink={<IoHammerOutline />}
                        caption="Administration"
                      />
                    </Link>
                  </div>
                )}
                <Link href="/HomeInfo">
                  <div onClick={removeProfile} className="btn-with-icon">
                    <div className="btn-with-icon__icon">
                      <IoAlarm />
                    </div>
                    <span className="btn-with-icon__text">
                      Deactivate Account
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
