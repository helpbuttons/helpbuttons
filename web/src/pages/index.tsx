import React from "react";
import type { Metadata, NextPage } from "next";
import { Store } from "store/Store";

//    Components

import { NetworksState, networksInitial } from "state/Networks";
import { UsersState, usersInitial } from "state/Users";
import { ExploreState, exploreInitial } from "state/Explore";
import { Alert } from "state/Alerts";
import { SetupDtoOut } from "services/Setup/config.type";
import { User } from "shared/entities/user.entity";
import { Activity } from "shared/entities/activity.entity";
import { Invite } from "shared/entities/invite.entity";
export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}

// -- estado global --
export interface GlobalState {
  networks: NetworksState;
  loggedInUser: User;
  knownUsers: User[];
  explore: ExploreState;
  alerts: Alert[];
  config: SetupDtoOut;
  activities: Activity[];
  showFilters: boolean;
  unreadActivities: number;
  draftNewCommentPost: any;
  invites: Invite[]
}

export const store = new Store<GlobalState>({
  networks: networksInitial,
  loggedInUser: false,
  knownUsers: [],
  explore: exploreInitial,
  alerts: [],
  config: null,
  activities: null,
  showFilters: false,
  unreadActivities: 0,
  draftNewCommentPost: null,
  invites: []
});


const Home: NextPage = () => {
  return (
      <></>
  );
};

export default Home;
