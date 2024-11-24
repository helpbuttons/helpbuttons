//Users buttons an profile info URL
import CardProfile from 'components/user/CardProfile';

import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import router, { useRouter } from 'next/router';
import { Logout } from 'state/Profile';
import Link from 'next/link';
import {
  IoBuildOutline,
  IoCreateOutline,
  IoDocument,
  IoDocumentTextOutline,
  IoFolderOutline,
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
  const sessionUser = useStore(
    store,
    (state: GlobalState) => state.sessionUser,
  );

  const { asPath } = useRouter();
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  
  function logout() {
    UserService.logout();
  }

  return (
    <>
          <Popup linkFwd="/Explore" title={t('user.profileView')}>
            <LoadabledComponent loading={!sessionUser}>
              <CardProfile user={sessionUser} />
              {(sessionUser && !sessionUser.phone && sessionUser?.role == Role.admin) && 
               <span style={{"color": "red"}}>{t('user.addSupport')}</span>
              }
                {sessionUser?.username == sessionUser?.username && (
                  <div className="card-profile__actions">
                    <Link href="/ProfileEdit">
                      <Btn
                        iconLeft={IconType.svg}
                        iconLink={<IoHammerOutline />}
                        caption={t('user.editProfile')}
                      />
                    </Link>
                    {false && 
                      <Link href="/">
                        <Btn
                          iconLeft={IconType.svg}
                          iconLink={<IoFolderOutline />}
                          caption={t('user.myHelpbuttons')}
                        />
                      </Link>
                    }
                    {/* {selectedNetwork?.inviteOnly &&  */}
                      {/* <Link href="/Profile/Invites">
                        <Btn
                          iconLeft={IconType.svg}
                          iconLink={<IoQrCodeOutline/>}
                          caption={t('invite.title')}
                        />
                      </Link> */}
                    {/* } */}
                    {sessionUser?.role == Role.admin && 
                      <AdminOptions/>
                    }
                    <Link href="/HomeInfo">
                      <div onClick={() => logout()} className="btn-with-icon">
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
