import CardProfile from 'components/user/CardProfile';
import Link from 'next/link';
import {
  IoBuildOutline,
  IoCreateOutline,
  IoFolderOutline,
  IoHammerOutline,
  IoLogOutOutline,
  IoQrCodeOutline,
} from 'react-icons/io5';
import Btn, { BtnType, IconType } from 'elements/Btn';
import { Role } from 'shared/types/roles';
import t from 'i18n';
import { LoadabledComponent } from 'components/loading';
import Popup from 'components/popup/Popup';
import { useGlobalStore } from 'state';
import router from 'next/router';

export default function Profile() {
  
  const sessionUser = useGlobalStore((state) => state.sessionUser)
  return (
    <>
          <Popup linkFwd="/Explore" title={t('user.profileView')}>
            <LoadabledComponent loading={!sessionUser}>
              <CardProfile user={sessionUser} />
              content list
            
              {/* {(sessionUser && !sessionUser.phone && sessionUser?.role == Role.admin) && 
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
                    {sessionUser?.role == Role.admin && 
                      <AdminOptions/>
                    }
                    <Link href="/">
                      <div onClick={() => router.push('/Logout')} className="btn-with-icon">
                        <div className="btn-with-icon__icon">
                          <IoLogOutOutline />
                        </div>
                        <span className="btn-with-icon__text">
                          {t('user.logout')}
                        </span>
                      </div>
                    </Link>
                  </div>
                )} */}
              
            </LoadabledComponent>
          </Popup>
    </>
  );
}

export function AdminOptions() {
  return (
    <>
        <Link href="/Configuration">
          <Btn
            btnType={BtnType.filter}
            iconLeft={IconType.svg}
            iconLink={<IoBuildOutline />}
            caption={t('configuration.title')}
          />
        </Link>
        <Link href="/Configuration/Moderation">
          <Btn
            btnType={BtnType.filter}
            iconLeft={IconType.svg}
            iconLink={<IoCreateOutline />}
            caption={t('configuration.moderation')}
          />
        </Link>
    </>
  );
}
