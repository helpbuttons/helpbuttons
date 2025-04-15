import CardProfile from 'components/user/CardProfile';
import Link from 'next/link';
import {
  IoBuildOutline,
  IoCreateOutline,
  IoFolderOutline,
  IoHammerOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import Btn, { IconType } from 'elements/Btn';
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
              {(sessionUser && !sessionUser.phone && sessionUser?.role == Role.admin) && 
               <span style={{"color": "red"}}>{t('user.addSupport')}</span>
              }
                
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
