//Users buttons an profile info URL
import {  store } from 'state';
import { useEffect, useState } from 'react';
import { FindUserButtons } from 'state/Users';

import { Role } from 'shared/types/roles';
import t from 'i18n';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import CardProfile from 'components/user/CardProfile';
import { useMetadataTitle } from 'state/Metadata';
import dconsole from 'shared/debugger';
import { SetMainPopupCurrentProfile } from 'state/HomeInfo';
import HomeInfo from 'pages/HomeInfo';
import { CardProfileButtonList } from 'components/user/CardProfileButtons';

export default function p(props) {
  useMetadataTitle(t('menu.login'))
  const { userProfile } = props;
  useEffect(() => {
      store.emit(new SetMainPopupCurrentProfile(userProfile))
  }, [])
  
  return (

          <HomeInfo metadata={props.metadata}/>
  );
}

export function ShowProfile({
  userProfile,
  sessionUser,
}) {
  const [userButtons, setUserButtons] = useState(null);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.showButtons) {
        dconsole.log('getting user btns');
        store.emit(
          new FindUserButtons(userProfile.id, (userButtons) =>
            setUserButtons(userButtons),
          ),
        );
      }
    }
  }, [userProfile]);



  useMetadataTitle(t('menu.profile'));


  return (
    <>
      {userProfile && (
        <CardProfile
          user={userProfile}
          showAdminOptions={sessionUser?.role == Role.admin}
        />
      )}
      {userProfile?.showButtons && <CardProfileButtonList buttons={userButtons}/>}
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.profile'), ctx);
};

