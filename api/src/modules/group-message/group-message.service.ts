import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ActivityEventName } from "@src/shared/types/activity.list";
import { Role } from "@src/shared/types/roles";
import { GroupMessageDtoOut, GroupMessages } from "./group-message.dto";
import { GroupMessage } from "./group-message.entity";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMessageType } from "@src/shared/types/group-message.enum";

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

            // TODO: missing READ!
            return {
                community: this.transformGroupMessage(commmunityLastMessage, false),
                admin: this.transformGroupMessage(adminLastMessage, true)
            }
        }) 
    }
    
    sendMessage(userId, groupMessageType , message)
    {
        // TODO: implement sending message
        console.log('send message to ' + groupMessageType + ' content: ' + message)
    }

    transformGroupMessage (groupMessage, type, read = false) {
        if(!groupMessage)
        {
            return null;
        }
        return {id: groupMessage.id, createdAt: groupMessage.created_at, title:groupMessage.from.name, message: groupMessage.message, read: read};
    }
}