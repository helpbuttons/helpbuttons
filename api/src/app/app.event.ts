import { User } from "@src/modules/user/user.entity"
import { ActivityEventName } from "@src/shared/types/activity.list"

export function notifyUser(eventEmitter, activityEventName : ActivityEventName, data: any, destination: User ) {
    eventEmitter.emit(activityEventName, 
        new ActivityEvent(data, destination, activityEventName)
      )
}

export class ActivityEvent {
    constructor (public data: any, public destination: User,public activityEventName : ActivityEventName) {}
}
