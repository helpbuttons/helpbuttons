import { ActivityEventName } from "@src/shared/types/activity.list"

export function emitActivity(eventEmitter, activityEventName : ActivityEventName, data: any ) {
    console.log('sending this data: ')
    console.log(data)

    eventEmitter.emit(activityEventName, 
        new ActivityEvent(data, activityEventName)
      )
}

export class ActivityEvent {
    constructor (public data: any,public activityEventName : ActivityEventName) {}
}
