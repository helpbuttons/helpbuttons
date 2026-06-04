import { ActivityEventName, AdminActivityEventName } from "@src/shared/types/activity.list"
import {  instanceToInstance } from "class-transformer";

export function notifyUser(eventEmitter, activityEventName : ActivityEventName, data: any) {
    eventEmitter.emit(activityEventName, 
        new ActivityEvent(instanceToInstance(data,{ excludeExtraneousValues: true }), activityEventName)
      )
}

export function notifyAdmins(eventEmitter, activityEventName : AdminActivityEventName, data: any) {
    eventEmitter.emit(activityEventName, 
        new AdminActivityEvent(instanceToInstance(data,{ excludeExtraneousValues: true }), activityEventName)
      )
}

export class ActivityEvent {
    constructor (public data: any,public activityEventName : ActivityEventName) {}
}

export class AdminActivityEvent {
    constructor (public data: any,public activityEventName : AdminActivityEventName) {}
}
