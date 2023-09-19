//Users buttons an profile info URL
import CardProfile, { LinkAdminButton } from 'components/user/CardProfile';

import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { User } from 'shared/entities/user.entity';
import { FindAdminButton, FindUser, Logout } from 'state/Users';
import Link from 'next/link';
import {
  IoAlarm,
  IoHammerOutline,
  IoHandLeftOutline,
  IoLogOutOutline,
  IoPersonAddOutline,
} from 'react-icons/io5';
import Btn, { IconType } from 'elements/Btn';
import { UserService } from 'services/Users';
import { Role } from 'shared/types/roles';
import t from 'i18n';
import { LoadabledComponent } from 'components/loading';

export default function Profile() {
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const [adminButtonId, setAdminButtonId] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.role == Role.admin) {
        store.emit(
          new FindAdminButton(loggedInUser.id, (buttonData) => {
            if (buttonData?.id) {
              setAdminButtonId(() => buttonData.id);
            }
          }),
        );
      }
    }
  }, [loggedInUser]);

  function logout() {
    UserService.logout();
    router.push('/HomeInfo');
  }

  const removeProfile = () => {
    console.log('remove myself!');
  };

  return (
    <>
      <div className="body__content">
        <div className="card-profile__container">
          <LoadabledComponent loading={!loggedInUser}>
            <CardProfile user={loggedInUser} />
            {loggedInUser?.role == Role.admin && adminButtonId && (
              <LinkAdminButton adminButtonId={adminButtonId}/>
            )}
            {loggedInUser?.username == loggedInUser?.username && (
              <div className="card-profile__actions">
                <Link href="/ProfileEdit">
                  <Btn
                    iconLeft={IconType.svg}
                    iconLink={<IoHammerOutline />}
                    caption={t('user.editProfile')}
                  />
                </Link>
                <Link href="/Profile/Invites">
                  <Btn
                    iconLeft={IconType.svg}
                    iconLink={<IoPersonAddOutline />}
                    caption={t('user.invites')}
                  />
                </Link>
                <Link href="/Explore">
                  <div onClick={logout} className="btn-with-icon">
                    <div className="btn-with-icon__icon">
                      <IoLogOutOutline />
                    </div>
                    <span className="btn-with-icon__text">
                      {t('user.logout')}
                    </span>
                  </div>
                </Link>

                {loggedInUser?.role == Role.admin && (
                  <>
                    <div>
                      <Link href="/Configuration">
                        <Btn
                          iconLeft={IconType.svg}
                          iconLink={<IoHammerOutline />}
                          caption={t('configuration.title')}
                        />
                      </Link>
                    </div>
                    {loggedInUser?.role == Role.admin &&
                      !adminButtonId && (
                        <div>
                          <Link href="/ButtonNew">
                            <Btn
                              iconLeft={IconType.svg}
                              iconLink={<IoHandLeftOutline />}
                              caption={t(
                                'configuration.createSupportButton',
                              )}
                            />
                          </Link>
                        </div>
                      )}
                  </>
                )}
                {/* <Link href="/HomeInfo">
                  <div onClick={removeProfile} className="btn-with-icon">
                    <div className="btn-with-icon__icon">
                      <IoAlarm />
                    </div>
                    <span className="btn-with-icon__text">
                      {t('user.deactivate')}
                    </span>
                  </div>
                </Link> */}
              </div>
            )}
          </LoadabledComponent>
        </div>
      </div>
    </>
  );
}

