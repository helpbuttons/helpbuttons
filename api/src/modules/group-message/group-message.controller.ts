import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GroupMessageService } from "./group-message.service";
import { OnlyAdmin, OnlyRegistered } from "@src/shared/decorator/roles.decorator";
import { CurrentUser } from "@src/shared/decorator/current-user";
import { User } from "../user/user.entity";
import { GroupMessageDtoOut } from "./group-message.dto";
import { GroupMessageType } from "@src/shared/types/group-message.enum";

@ApiTags('group-message')
@Controller('group-message')
export class GroupMessageController {
    constructor(private readonly groupMessageService: GroupMessageService,
    ) { }
    
    @OnlyAdmin()
    @Post('send/admin')
    async sendAdminMessage(@CurrentUser() user: User, @Body() message) {
        return this.groupMessageService.sendMessage(user.id, GroupMessageType.admin, message)
    }

    @OnlyRegistered()
    @Post('send/community')
    async sendCommunityMessage(@CurrentUser() user: User, @Body() message) {
        return this.groupMessageService.sendMessage(user.id, GroupMessageType.community, message)
    }
}