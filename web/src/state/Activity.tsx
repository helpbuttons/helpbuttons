import produce from 'immer';
import { GlobalState, store } from 'pages';
import { catchError, map } from 'rxjs';
import { ActivityService } from 'services/Activity';
import { Activity } from 'shared/entities/activity.entity';
import { ActivityEventName } from 'shared/types/activity.list';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { handleError } from './helper';
import { of } from 'rxjs';

export class FindActivities implements WatchEvent {
  public constructor() {}

  public watch(state: GlobalState) {
    if(!state.loggedInUser)
    {
      return of(undefined)
    }
    return ActivityService.find().pipe(
      map((activities: Activity[]) => {
        activities.map((activity) => {
          switch (activity.eventName) {
            case ActivityEventName.NewButton:
              {
                activity.data = JSON.parse(activity.data);
              }
              break;
          }
          return activity;
        });
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
  public constructor(private activities: Activity[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities = this.activities;
      newState.unreadActivities = unreadActivities(this.activities)
    });
  }
}

export class ActivityMarkAllAsRead implements WatchEvent,UpdateEvent {
  public constructor() {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.activities = state.activities;
      newState.unreadActivities = 0
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

export const refeshActivities = () => {
  store.emit(
    new FindActivities(),
  );
}
  