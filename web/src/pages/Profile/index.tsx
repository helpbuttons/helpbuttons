//Users buttons an profile info URL
import CardProfile from 'components/user/CardProfile';

import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import router, { useRouter } from 'next/router';
import { Logout } from 'state/Users';
import Link from 'next/link';
import {
  IoBuildOutline,
  IoCreateOutline,
  IoDocumentTextOutline,
  IoHammerOutline,
  IoLogOutOutline,
  IoQrCodeOutline,
} from 'react-icons/io5';
import Btn, { IconType } from 'elements/Btn';
import { UserService } from 'services/Users';
import { Role } from 'shared/types/roles';
import t from 'i18n';
import { LoadabledComponent } from 'components/loading';
import Popup from 'components/popup/Popup';
import { getLocale } from 'shared/sys.helper';
import { Network } from 'shared/entities/network.entity';

export default function Profile() {
  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const { asPath } = useRouter();
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  function logout() {
    UserService.logout();
    if (getLocale() != selectedNetwork.locale) {
      router.push({ pathname: '/HomeInfo'}, asPath, {
        locale: selectedNetwork.locale,
      });
    }else{
          router.push({ pathname: '/HomeInfo'})
    }
  }

  return (
    <>
          <Popup linkFwd="/Explore" title={t('user.profileView')}>
            <LoadabledComponent loading={!loggedInUser}>
              <CardProfile user={loggedInUser} />
              {(loggedInUser && !loggedInUser.phone && loggedInUser?.role == Role.admin) && 
               <span style={{"color": "red"}}>{t('user.addSupport')}</span>
              }
                {loggedInUser?.username == loggedInUser?.username && (
                  <div className="card-profile__actions">
                    <Link href="/ProfileEdit">
                      <Btn
                        iconLeft={IconType.svg}
                        iconLink={<IoHammerOutline />}
                        caption={t('user.editProfile')}
                      />
                    </Link>
                    {/* {selectedNetwork?.inviteOnly &&  */}
                      <Link href="/Profile/Invites">
                        <Btn
                          iconLeft={IconType.svg}
                          iconLink={<IoQrCodeOutline/>}
                          caption={t('invite.title')}
                        />
                      </Link>
                    {/* } */}
                    <Link href="/Bulletin">
                        <Btn
                          iconLeft={IconType.svg}
                          iconLink={<IoDocumentTextOutline/>}
                          caption={t('bulletin.title')}
                        />
                    </Link>
                    {loggedInUser?.role == Role.admin && 
                      <AdminOptions/>
                    }
                    <Link href="/HomeInfo">
                      <div onClick={logout} className="btn-with-icon">
                        <div className="btn-with-icon__icon">
                          <IoLogOutOutline />
                        </div>
                        <span className="btn-with-icon__text">
                          {t('user.logout')}
                        </span>
                      </div>
                    </Link>
                  </div>
                )}
              
            </LoadabledComponent>
          </Popup>
    </>
  );
}

function AdminOptions() {
  return (
    <>
      <div>
        <Link href="/Configuration">
          <Btn
            iconLeft={IconType.svg}
            iconLink={<IoBuildOutline />}
            caption={t('configuration.title')}
          />
        </Link>
      </div>
      <div>
        <Link href="/Configuration/Moderation">
          <Btn
            iconLeft={IconType.svg}
            iconLink={<IoCreateOutline />}
            caption={t('configuration.moderation')}
          />
        </Link>
      </div>
    </>
  );
}
