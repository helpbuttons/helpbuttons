import { Injectable } from "@nestjs/common";
import { Role } from "@src/shared/types/roles";
import {  GroupMessages } from "./group-message.dto";
import { GroupMessage } from "./group-message.entity";
import { In, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMessageType } from "@src/shared/types/group-message.enum";
import { uuid } from "@src/shared/helpers/uuid.helper";
import { ActivitiesPageSize } from "../activity/activity.dto";
import { UserService } from "../user/user.service";
import translate from "@src/shared/helpers/i18n.helper";
import { OnEvent } from "@nestjs/event-emitter";
import { AdminActivityEventName } from "@src/shared/types/activity.list";

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
        return this.groupMessageRepository.find({where: conditions, relations: ['from']}).then(async (groupMessages) => {
            
            const commmunityLastMessage = groupMessages.find((groupMessage) => groupMessage.to == GroupMessageType.community)

            const adminLastMessage = groupMessages.find((groupMessage) => groupMessage.to == GroupMessageType.admin)

            const readAdmin = user?.readGroupMessages?.admin ? this.isRead(adminLastMessage?.created_at, user?.readGroupMessages?.admin) : false;

            let unreadAdmin = 0
            if(user.role != Role.admin){
                unreadAdmin = 0
            }else if(user?.readGroupMessages.admin){
                unreadAdmin = await this.groupMessageRepository.count({where: {created_at: MoreThan(user?.readGroupMessages.admin), to: GroupMessageType.admin }})
            }else{ 
                unreadAdmin = await this.groupMessageRepository.count({where: {to: GroupMessageType.admin}})
            }

            let unreadCommunity = 0
            if(user?.readGroupMessages?.community){
                unreadCommunity = await this.groupMessageRepository.count({where: {created_at: MoreThan(user?.readGroupMessages.community), to: GroupMessageType.community}})
            }else{
                unreadCommunity = await this.groupMessageRepository.count({where: {to: GroupMessageType.community}})
            }
            
            const readCommunity = user?.readGroupMessages?.community ? this.isRead(commmunityLastMessage?.created_at, user?.readGroupMessages?.community) : false;
            return {
                community: {lastMessage: this.transformGroupMessage(commmunityLastMessage, user, readCommunity), unreadCount: unreadCommunity},
                admin: {lastMessage: this.transformGroupMessage(adminLastMessage, user, readAdmin), unreadCount: unreadAdmin}
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
            return this.groupMessageRepository.insert([groupMessage])
        })
        
    }

    sendNotification(link, groupMessageType : GroupMessageType, eventName: AdminActivityEventName)
    {
        const groupMessage = {
            id: uuid(),
            to: groupMessageType,
            last: true,
            message: '',
            link,
            eventName: eventName
        }

        return this.groupMessageRepository.update({ to: groupMessageType }, { last: false })
        .then(()=> {
            return this.groupMessageRepository.insert([groupMessage])
        })
        
    }

    transformGroupMessage (groupMessage, user, read = false) {
        if(!groupMessage)
        {
            return null;
        }

        let message = groupMessage.message
        if(groupMessage.eventName) {
            switch(groupMessage.eventName){
                case AdminActivityEventName.AwaitApprovalButton:
                    message = translate(user.locale, `button.awaitApproval`)
            }
        }
        if(groupMessage?.from?.id == user.id)
        {
            return {id: groupMessage.id, createdAt: groupMessage.created_at, title: translate(user.locale,'groupChat.you') , message: message, read: true, to: groupMessage.to, link: groupMessage.link};
        }else{            
            return {id: groupMessage.id, createdAt: groupMessage.created_at, title: groupMessage?.from?.name, message: message, read: read, from: groupMessage?.from?.name, activityFrom: groupMessage?.from, to: groupMessage.to, link: groupMessage.link};
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
        return this.groupMessageRepository.find({where: { to: In([GroupMessageType.community, GroupMessageType.endorsed])}, relations: ['from'], take: ActivitiesPageSize, skip: page * ActivitiesPageSize,order: { created_at: 'DESC' }})
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


    @OnEvent(AdminActivityEventName.AwaitApprovalButton)
    onAwaitApprovalButton(payload: any){
        const { button } = payload.data
        this.sendNotification(`/Show/${button.id}`, GroupMessageType.admin, AdminActivityEventName.AwaitApprovalButton)
    }
}