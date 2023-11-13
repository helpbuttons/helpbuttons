import { User } from "@src/modules/user/user.entity"
import { ActivityEventName } from "@src/shared/types/activity.list"

export function notifyUser(eventEmitter, activityEventName : ActivityEventName, data: any) {
    eventEmitter.emit(activityEventName, 
        new ActivityEvent(data, activityEventName)
      )
}

export class ActivityEvent {
    constructor (public data: any,public activityEventName : ActivityEventName) {}
}
