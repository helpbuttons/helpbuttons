import React from "react";
import type { NextPage } from "next";
import { Store } from "store/Store";

//    Components
import HomeInfo from "pages/HomeInfo";

import { NetworksState, networksInitial } from "state/Networks";
import { UsersState, usersInitial } from "state/Users";
import { ExploreState, exploreInitial } from "state/Explore";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Alert } from "state/Alerts";
import { IConfig } from "services/Setup/config.type";

// -- estado global --
export interface GlobalState {
  networks: NetworksState;
  users: UsersState;
  explore: ExploreState;
  alerts: Alert[];
  config: IConfig;
}

export const store = new Store<GlobalState>({
  networks: networksInitial,
  users: usersInitial,
  explore: exploreInitial,
  alerts: [],
  config: null,
});

const Home: NextPage = () => {
  return (
      <HomeInfo />
  );
};

export default Home;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}