import React from "react";
import type { NextPage, NextPageContext } from "next";
import HomeInfo from "./HomeInfo";
import { setLocale } from "shared/sys.helper";
import { setMetadata } from "services/ServerProps";
import t from "i18n";


const Home: NextPage = (props) => {
  return (
      <HomeInfo metadata={props.metadata}/>
  );
};

export default Home;

export const getServerSideProps = async (ctx: NextPageContext) => {
  setLocale(ctx.locale);
  return setMetadata(t('menu.home'), ctx);
};