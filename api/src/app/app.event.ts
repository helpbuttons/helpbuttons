import { ActivityEventName, GroupActivityEventName } from "@src/shared/types/activity.list"
import {  instanceToInstance } from "class-transformer";

export function notifyUser(eventEmitter, activityEventName : ActivityEventName, data: any) {
    eventEmitter.emit(activityEventName, 
        new ActivityEvent(instanceToInstance(data,{ excludeExtraneousValues: true }), activityEventName)
      )
}

export function notifyGroup(eventEmitter, activityEventName : GroupActivityEventName, data: any) {
    eventEmitter.emit(activityEventName, 
        new GroupActivityEvent(instanceToInstance(data,{ excludeExtraneousValues: true }), activityEventName)
      )
}

export class ActivityEvent {
    constructor (public data: any,public activityEventName : ActivityEventName) {}
}

export class GroupActivityEvent {
    constructor (public data: any,public activityEventName : GroupActivityEventName) {}
}
