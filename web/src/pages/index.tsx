import React from "react";
import type { NextPage } from "next";
import HomeInfo from "./HomeInfo";
import t from "i18n";
import Explore from "./Explore";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import { getServerSidePropsHandler, shouldEnableSSR } from "shared/staticapp.utils";


export const Home: NextPage = (props) => {
  const cookiesAccepted = localStorageService.read(LocalStorageVars.COOKIES_ACCEPTANCE)
  
  if(cookiesAccepted)
  {
    return (<Explore metadata={props.metadata}/>);
  }
  return (
      <HomeInfo metadata={props.metadata}/>
  );
};

export default Home;


export const getServerSideProps = shouldEnableSSR
  ? (ctx) => getServerSidePropsHandler(t('menu.home'), ctx)
  : undefined;