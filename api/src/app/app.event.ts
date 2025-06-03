import { Button } from "@src/modules/button/button.entity.js";
import { Post } from "@src/modules/post/post.entity.js";
import { User } from "@src/modules/user/user.entity.js"
import { ActivityEventName } from "@src/shared/types/activity.list.js"
import { ClassConstructor, instanceToInstance, plainToInstance } from "class-transformer";

export function notifyUser(eventEmitter, activityEventName : ActivityEventName, data: any) {
    eventEmitter.emit(activityEventName, 
        new ActivityEvent(instanceToInstance(data,{ excludeExtraneousValues: true }), activityEventName)
      )
}

export class ActivityEvent {
    constructor (public data: any,public activityEventName : ActivityEventName) {}
}
