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

import { CommonState, commonInitial } from "pages/Common/data";
import { ExploreState, exploreInitial } from "pages/Explore/data";

// -- estado global --
export interface GlobalState {
  common: CommonState;
  explore: ExploreState;
}

export const store = new Store<GlobalState>({
  common: commonInitial,
  explore: exploreInitial,
});

const Home: NextPage = () => {
  return (

      <HomeInfo />

  );
};

export default Home;
