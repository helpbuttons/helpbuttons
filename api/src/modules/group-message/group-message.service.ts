import { Injectable } from "@nestjs/common";
import { Role } from "@src/shared/types/roles";
import {  GroupMessages } from "./group-message.dto";
import { GroupMessage } from "./group-message.entity";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMessageType } from "@src/shared/types/group-message.enum";
import { uuid } from "@src/shared/helpers/uuid.helper";
import { ActivitiesPageSize } from "../activity/activity.dto";
import { UserService } from "../user/user.service";
import translate from "@src/shared/helpers/i18n.helper";

@Injectable()
export class GroupMessageService {
    constructor(
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>,
        private readonly userService: UserService,
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

            const readAdmin = user?.readGroupMessages?.admin ? this.isRead(adminLastMessage?.created_at, user?.readGroupMessages?.admin) : false;

            const readCommunity = user?.readGroupMessages?.community ? this.isRead(commmunityLastMessage?.created_at, user?.readGroupMessages?.community) : false;

            return {
                community: this.transformGroupMessage(commmunityLastMessage, user, readCommunity),
                admin: this.transformGroupMessage(adminLastMessage, user, readAdmin)
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

    transformGroupMessage (groupMessage, user, read = false) {
        if(!groupMessage)
        {
            return null;
        }

        if(groupMessage.from.id == user.id)
        {
            return {id: groupMessage.id, createdAt: groupMessage.created_at, title: translate(user.locale,'groupChat.you') , message: groupMessage.message, read: true};
        }else{            
            return {id: groupMessage.id, createdAt: groupMessage.created_at, title:groupMessage.from.name, message: groupMessage.message, read: read, from: groupMessage.from.name, activityFrom: groupMessage?.from};
        }
        
    }

    findAdminMessages(user, page = 0){
        this.markAsRead(user, GroupMessageType.admin)
        return this.groupMessageRepository.find({where: { to:GroupMessageType.admin}, relations: ['from'], take: ActivitiesPageSize, skip: page * ActivitiesPageSize,order: { created_at: 'DESC' }})
        .then((messages) => messages.map(_msg => 
            {
                return this.transformGroupMessage(_msg, user, true)
            }))
    }

    findCommunityMessages(user, page = 0)
    {
        this.markAsRead(user, GroupMessageType.community)
        return this.groupMessageRepository.find({where: { to:GroupMessageType.community}, relations: ['from'], take: ActivitiesPageSize, skip: page * ActivitiesPageSize,order: { created_at: 'DESC' }})
        .then((messages) => messages.map(_msg => {
            return this.transformGroupMessage(_msg, user, true) 
        } ))
    }

    markAsRead(user, groupMessageType){
        return this.userService.markAsRead(user, groupMessageType, new Date())
    }

    isRead(messageCreatedAt, lastDateRead)
    {
        if(new Date(messageCreatedAt) > new Date(lastDateRead)){
            return false;
        }
        return true;
    }
}