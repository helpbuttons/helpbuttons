import React, { useEffect, useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Store } from "store/Store";
import { Event } from "store/Event";

//services
import { userService } from 'services/Users';
import ButtonDataService from "services/Buttons";
import { authenticationService } from 'services';

//    Components
import HomeInfo from "pages/HomeInfo";

import { NetworksState, networksInitial } from "state/Networks";
import { UsersState, usersInitial } from "state/Users";
import { ExploreState, exploreInitial } from "state/Explore";

// -- estado global --
export interface GlobalState {
  networks: NetworksState;
  users: UsersState;
  explore: ExploreState;
}

export const store = new Store<GlobalState>({
  networks: networksInitial,
  users: usersInitial,
  explore: exploreInitial,
});

const Home: NextPage = () => {
  return (
      <HomeInfo />
  );
};

export default Home;
