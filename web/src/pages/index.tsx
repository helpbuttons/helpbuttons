import React from "react";
import type { NextPage, NextPageContext } from "next";
import HomeInfo from "./HomeInfo";
import { setLocale } from "shared/sys.helper";
import { setMetadata } from "services/ServerProps";
import t from "i18n";
import Explore from "./Explore";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";


const Home: NextPage = (props) => {
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

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.home'), ctx);
};