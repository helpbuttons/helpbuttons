import { User } from 'shared/entities/user.entity';
import { NetworksState, networksInitial } from './Networks';
import { ExploreState, exploreInitial } from './Explore';
import { Alert } from './Alerts';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { Invite } from 'shared/entities/invite.entity';
import { HomeInfoState, homeInfoStateInitial } from './HomeInfo';
import { Activities, activitiesInitialState } from './Activity';
import { MetadataState, metadataInitialState } from './Metadata';
import { CacheValue } from './Cache';
import { Store, useRef } from '../store/Store';

// -- estado global --
export interface GlobalState {
  networks: NetworksState;
  sessionUser: User;
  knownUsers: User[];
  explore: ExploreState;
  alerts: Alert[];
  config: SetupDtoOut;
  draftNewCommentPost: any;
  invites: Invite[];
  homeInfo: HomeInfoState;
  activities: Activities;
  metadata: MetadataState;
  cacheValues: CacheValue[];
  signupTags: string[];
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
  unreadActivities: 0,
  draftNewCommentPost: null,
  invites: [],
  homeInfo: homeInfoStateInitial,
  activities: activitiesInitialState,
  metadata: metadataInitialState,
  cacheValues: [],
  signupTags: []
});

export function useGlobalStore(localState) {
  return useStore(store, localState, false);
}
export function useStore(store: Store<GlobalState>, selector: Function, defaultNull = true) {
  return useRef(store, selector, defaultNull)
}