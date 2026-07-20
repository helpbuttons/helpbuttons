import t from 'i18n';
import { NextPageContext } from 'next';
import HomeInfo from 'pages/HomeInfo';
import { useEffect } from 'react';
import {  setMetadata } from 'services/ServerProps';
import { store } from 'state';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useMetadataTitle } from 'state/Metadata';
import { getServerSidePropsHandler, shouldEnableSSR } from 'shared/tauri.utils';
export default Login;

function Login({metadata}) {
    useMetadataTitle(t('menu.login'))
    useEffect(() => {
        store.emit(new SetMainPopup(MainPopupPage.LOGIN))
    }, [])
    
    return (

            <HomeInfo metadata={metadata}/>
    );
}

export const getServerSideProps = shouldEnableSSR
  ? (ctx) => getServerSidePropsHandler(t('menu.login'), ctx)
  : undefined;