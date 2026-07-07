import {
    Controller,
    Post,
    Delete,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Param,
} from '@nestjs/common'
import { PushNotificationService } from './push-notification.service'
import { SubscribeDto } from './push-notification.dto'
import { CurrentUser } from '@src/shared/decorator/current-user'
import { User } from '../user/user.entity'
import { AllowGuest, OnlyRegistered } from '@src/shared/decorator/roles.decorator'

@Controller('push')
export class PushNotificationController {
    constructor(private readonly pushService: PushNotificationService) { }

    @AllowGuest()
    @Get('vapid-public-key')
    getVapidPublicKey() {
        return { publicKey: this.pushService.getVapidPublicKey() }
    }

    @OnlyRegistered()
    @Post('subscribe')
    @HttpCode(HttpStatus.CREATED)
    async subscribe(
        @Body() subscribeDto: SubscribeDto,
        @CurrentUser() user: User,
    ) {
        return this.pushService.subscribe(user, subscribeDto)
    }

    @OnlyRegistered()
    @Delete('unsubscribe')
    @HttpCode(HttpStatus.OK)
    async unsubscribe(@CurrentUser() user: User) {
        return this.pushService.unsubscribe(user)
    }

    @Get('send/:message')
    @HttpCode(HttpStatus.OK)
    async sendToAll(@Param('message') message: string) {
        try {
            return await this.pushService.sendNotificationToAll(message)
        } catch (error) {
            throw new InternalServerErrorException('Failed to send notifications')
        }
    }
    // @Get('status')
    // getStatus() {
    //   return {
    //     subscriptions: this.pushService.getSubscriptionCount(),
    //   }
    // }
}