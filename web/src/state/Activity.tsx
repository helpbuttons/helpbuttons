import produce from "immer";
import { GlobalState } from "pages";
import { map } from "rxjs";
import { ActivityService } from "services/Activity";
import { Activity } from "shared/entities/activity.entity";
import { ActivityEventName } from "shared/types/activity.list";
import { UpdateEvent, WatchEvent } from "store/Event";

export class FindActivities implements WatchEvent {
    public constructor() {}
  
    public watch(state: GlobalState) {
      return ActivityService.find().pipe(
        map((activities : Activity[]) => {
          activities.map((activity) => {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton: {
                activity.button = JSON.parse(activity.data)
              };
              break;
            }
            return activity; 
          })
          return new ActivitiesFound(activities)
        }),
      );
    }
  }
  // {
  //   activities = activities.map((activity) => {
  //     activity.data = JSON.parse(activity.data)
  //     return activity
  //   })
  //   console.log(activities)
  export class ActivitiesFound implements UpdateEvent {
    public constructor(private activities: Activity[]) {}
  
    public update(state: GlobalState) {
      return produce(state, newState => {
        newState.activities = this.activities;
      });
    }
  }
  
//   export class FindAddress implements WatchEvent {
//     public constructor(private q: string, private onSuccess, private onError) {}
  
//     public watch(state: GlobalState) {
//       const t =  GeoService.findPromise(this.q)
//       .then((place) =>
//         this.onSuccess(place)  
//       )
//       .catch((error) => {
//         this.onError(error)
//       })
//     }
//   }
  