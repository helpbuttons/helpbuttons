import React from "react";
import type { NextPage } from "next";
import { Store } from "store/Store";

//    Components
import HomeInfo from "pages/HomeInfo";

import { NetworksState, networksInitial } from "state/Networks";
import { UsersState, usersInitial } from "state/Users";
import { ExploreState, exploreInitial } from "state/Explore";
import { Alert } from "state/Alerts";
import { SetupDtoOut } from "services/Setup/config.type";
import { User } from "shared/entities/user.entity";
import { Activity } from "shared/entities/activity.entity";

// -- estado global --
export interface GlobalState {
  networks: NetworksState;
  loggedInUser: User;
  knownUsers: User[];
  explore: ExploreState;
  alerts: Alert[];
  config: SetupDtoOut;
  activities: Activity[];
}

export const store = new Store<GlobalState>({
  networks: networksInitial,
  loggedInUser: null,
  knownUsers: [],
  explore: exploreInitial,
  alerts: [],
  config: null,
  activities: []
});

const Home: NextPage = () => {
  return (
      <HomeInfo />
  );
};

export default Home;
