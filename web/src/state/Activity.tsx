import produce from "immer";
import { GlobalState } from "pages";
import { catchError, map } from "rxjs";
import { ActivityService } from "services/Activity";
import { Activity } from "shared/entities/activity.entity";
import { ActivityEventName } from "shared/types/activity.list";
import { UpdateEvent, WatchEvent } from "store/Event";
import { handleError } from "./helper";

export class FindActivities implements WatchEvent {
    public constructor(public onSuccess, public onError) {}
  
    public watch(state: GlobalState) {
      return ActivityService.find().pipe(
        map((activities : Activity[]) => {
          activities.map((activity) => {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton: {
                activity.data = JSON.parse(activity.data)
              };
              break;
            }
            return activity; 
          })
          this.onSuccess()
          return new ActivitiesFound(activities)
        }),
        catchError((error) => handleError(this.onError, error))
      );
    }
  }
  export class ActivitiesFound implements UpdateEvent {
    public constructor(private activities: Activity[]) {}
  
    public update(state: GlobalState) {
      return produce(state, newState => {
        newState.activities = this.activities;
      });
    }
  }
  
  