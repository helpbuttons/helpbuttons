import React from "react";
import type { Metadata, NextPage } from "next";
import { Store } from "store/Store";

//    Components

import { NetworksState, networksInitial } from "state/Networks";
import { ExploreState, exploreInitial } from "state/Explore";
import { Alert } from "state/Alerts";
import { User } from "shared/entities/user.entity";
import { Invite } from "shared/entities/invite.entity";
import { HomeInfoState, homeInfoStateInitial } from "state/HomeInfo";
import { Activities, activitiesInitialState } from "state/Activity";
import { MetadataState, metadataInitialState } from "state/Metadata";
import { CacheValue } from "state/Cache";

// -- estado global --
export interface GlobalState {
  networks: NetworksState;
  sessionUser: User;
  knownUsers: User[];
  explore: ExploreState;
  alerts: Alert[];
  config: SetupDtoOut;
  showFilters: boolean;
  draftNewCommentPost: any;
  invites: Invite[],
  homeInfo: HomeInfoState,
  activities: Activities,
  metadata: MetadataState,
  cacheValues: CacheValue[],
  // newNotifications: NewNotification[]
}

// interface NewNotification{
//   message: string;
//   created_at: string;
  
// }

export const store = new Store<GlobalState>({
  networks: networksInitial,
  sessionUser: false,
  knownUsers: [],
  explore: exploreInitial,
  alerts: [],
  config: null,
  showFilters: false,
  unreadActivities: 0,
  draftNewCommentPost: null,
  invites: [],
  homeInfo: homeInfoStateInitial,
  activities: activitiesInitialState,
  metadata: metadataInitialState,
  cacheValues: []
});


const Home: NextPage = () => {
  return (
      <></>
  );
};

export default Home;
