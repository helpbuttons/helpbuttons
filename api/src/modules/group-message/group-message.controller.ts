import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GroupMessageService } from "./group-message.service";
import { OnlyAdmin, OnlyRegistered } from "@src/shared/decorator/roles.decorator";
import { CurrentUser } from "@src/shared/decorator/current-user";
import { User } from "../user/user.entity";
import { GroupMessageType } from "@src/shared/types/group-message.enum";
import { UserService } from "../user/user.service";
@ApiTags('group-message')
@Controller('group-message')
export class GroupMessageController {
    constructor(private readonly groupMessageService: GroupMessageService,
    private readonly userService: UserService,
    ) { }
    
    @OnlyAdmin()
    @Post('send/admin')
    async sendAdminMessage(@CurrentUser() user: User, @Body() message) {
        return this.groupMessageService.sendMessage(user, GroupMessageType.admin, message.message)
    }

    @OnlyRegistered()
    @Post('send/community')
    async sendCommunityMessage(@CurrentUser() user: User, @Body() message) {
        return this.groupMessageService.sendMessage(user, GroupMessageType.community, message.message)
    }

    @OnlyAdmin()
    @Post('send/endorsed')
    async sendEndorsedMessage(@CurrentUser() user: User, @Body() message) {
        this.userService.notifyByEmailEndorsedAndAdmins(message.message);
        return this.groupMessageService.sendMessage(user, GroupMessageType.endorsed, message.message)
    }

    @OnlyAdmin()
    @Get('messages/admin/:page')
    async messagesAdmin(@CurrentUser() user: User, @Param('page') page: number) {
        return this.groupMessageService.findAdminMessages(user, page)
    }

    @OnlyRegistered()
    @Get('messages/community/:page')
    async messagesCommunity(@CurrentUser() user: User, @Param('page') page: number) {
        return this.groupMessageService.findCommunityMessages(user, page)
    }
}