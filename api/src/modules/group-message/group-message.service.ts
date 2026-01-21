import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ActivityEventName } from "@src/shared/types/activity.list";
import { Role } from "@src/shared/types/roles";
import { GroupMessageDtoOut, GroupMessages } from "./group-message.dto";
import { GroupMessage } from "./group-message.entity";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMessageType } from "@src/shared/types/group-message.enum";
import { uuid } from "@src/shared/helpers/uuid.helper";
import { ActivitiesPageSize } from "../activity/activity.dto";

@Injectable()
export class GroupMessageService {
    constructor(
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>,
    ) { }

    findByUser(user): Promise<GroupMessages> 
    {
        // check if user read this message...
        let conditions = {last: true, to: GroupMessageType.community}        
        if(user.role == Role.admin){
            //@ts-ignore
            conditions = {last: true, to: In([GroupMessageType.community, GroupMessageType.admin])}
            
        }
        return this.groupMessageRepository.find({where: conditions, relations: ['from']}).then((groupMessages) => {
            
            const commmunityLastMessage = groupMessages.find((groupMessage) => groupMessage.to == GroupMessageType.community)

            const adminLastMessage = groupMessages.find((groupMessage) => groupMessage.to == GroupMessageType.admin)

            return {
                community: this.transformGroupMessage(commmunityLastMessage, user.id),
                admin: this.transformGroupMessage(adminLastMessage, user.id)
            }
        }) 
    }
    
    sendMessage(user, groupMessageType : GroupMessageType, message)
    {
        const groupMessage = {
            id: uuid(),
            from: user,
            to: groupMessageType,
            last: true,
            message: message
        }

        return this.groupMessageRepository.update({ to: groupMessageType }, { last: false })
        .then(()=> {
            this.groupMessageRepository.insert([groupMessage])
        })
        
    }

    transformGroupMessage (groupMessage, userId) {
        if(!groupMessage)
        {
            return null;
        }
        if(groupMessage.from.id == userId)
        {
            return {id: groupMessage.id, createdAt: groupMessage.created_at, title:groupMessage.from.name, message: groupMessage.message, read: false};
        }else{
            return {id: groupMessage.id, createdAt: groupMessage.created_at, title:groupMessage.from.name, message: groupMessage.message, read: false, from: groupMessage.from.name, activityFrom: groupMessage?.from};
        }
        
    }

    findAdminMessages(userId, page = 0){
        return this.groupMessageRepository.find({where: { to:GroupMessageType.admin}, relations: ['from'], take: ActivitiesPageSize, skip: page * ActivitiesPageSize,order: { created_at: 'DESC' }})
        .then((messages) => messages.map(_msg => this.transformGroupMessage(_msg, userId)))
    }

    findCommunityMessages(userId, page = 0)
    {
        return this.groupMessageRepository.find({where: { to:GroupMessageType.community}, relations: ['from'], take: ActivitiesPageSize, skip: page * ActivitiesPageSize,order: { created_at: 'DESC' }})
        .then((messages) => messages.map(_msg => this.transformGroupMessage(_msg, userId)))
    }
}