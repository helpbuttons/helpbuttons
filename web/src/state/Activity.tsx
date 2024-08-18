import produce from 'immer';
import { GlobalState, store } from 'pages';
import { catchError, map } from 'rxjs';
import { ActivityService } from 'services/Activity';
import { Activity, ActivityDtoOut } from 'shared/entities/activity.entity';
import { ActivityEventName } from 'shared/types/activity.list';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { of } from 'rxjs';
import { useStore } from 'store/Store';
import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'shared/custom.hooks';

export interface ActivitiesState {
  activities: ActivityDtoOut[];
  notificationsPermissionGranted: boolean;
}

export const activitiesInitialState: ActivitiesState = {
  activities: [],
  notificationsPermissionGranted: false,
};

export class FindActivities implements WatchEvent {
  public constructor() {}

  public watch(state: GlobalState) {
    if(!state.loggedInUser)
    {
      return of(undefined)
    }
    return ActivityService.find().pipe(
      map((activities: ActivityDtoOut[]) => {
        store.emit(new ActivitiesFound(activities));
      }),
      catchError((error) => {
        console.error(error)
        return of(undefined)
      }),
    );
  }
}
export class ActivitiesFound implements UpdateEvent {
  public constructor(private activities: ActivityDtoOut[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activitesState.activities = this.activities;
    });
  }
}

export class ActivityMarkAllAsRead implements WatchEvent,UpdateEvent {
  public constructor() {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activitesState.activities = state.activitesState.activities.map((activity) => { return {...activity, unread: false}});
    });
  }
  public watch(state: GlobalState) {
    return ActivityService.markAllAsRead()
  }
}

export const unreadActivities = (activities) => {
  return activities.reduce((accumulator, activity) => {
    if (!activity.read) {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);
};


export const activityTo = (activity: Activity) => {
  console.log(activity)
  switch(activity.eventName)
  {
    case '':
      return {type:'this', message: 'oloooow'}

  }
  return {type:activity.eventName, message: 'tralalla'}
}

export const useActivities = () => {
  const activities = useStore(
    store,
    (state: GlobalState) => state.activitesState.activities,
  );
  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  const [countUnreadActivities, setCountUnreadActivities] = useState(0);

  useEffect(() => {
    if(loggedInUser){
      store.emit(new FindActivities())
    }
  }, [loggedInUser])
  useEffect(() => {
    if(activities)
    {
      setCountUnreadActivities(() => {
        return unreadActivities(activities)
      })
    }
  }, [activities])

  const increment = useCallback(() => { store.emit(new FindActivities()) }, []);
  useInterval(increment, 20000, { paused: !loggedInUser });

  return {activities, unreadActivities: countUnreadActivities}
}