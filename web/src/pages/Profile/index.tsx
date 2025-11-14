import CardProfile from 'components/user/CardProfile';
import Link from 'next/link';
import {
  IoBuildOutline,
  IoCreateOutline
} from 'react-icons/io5';
import Btn, { BtnType, IconType } from 'elements/Btn';
import t from 'i18n';
import { LoadabledComponent } from 'components/loading';
import Popup from 'components/popup/Popup';
import { store, useGlobalStore } from 'state';
import { FindMyButtons } from 'state/Users';
import { useEffect, useState } from 'react';
import { CardProfileButtonList } from 'components/user/CardProfileButtons';

export default function Profile() {


  const sessionUser = useGlobalStore((state) => state.sessionUser)
  const [buttons, setButtons] = useState([])
  useEffect(() => {
    if (sessionUser) {
        store.emit(
          new FindMyButtons((btns) =>
            setButtons(() => btns),
          ),
        );
      }
    }, [sessionUser]);
  return (
    <>
          <Popup linkFwd="/Explore" title={t('user.profileView')}>
            <LoadabledComponent loading={!sessionUser}>
              <CardProfile user={sessionUser} showProfileEdit={true} />
              <CardProfileButtonList buttons={buttons}/>
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
