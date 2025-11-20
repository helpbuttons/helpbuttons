import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { AllowGuest, OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { User } from '../user/user.entity';
import { ActivityService } from './activity.service';
import { ActivityCron } from './activity.cron';
import { ActivityDtoOut, MessageDto } from './activity.dto';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService,
    private readonly activityCron: ActivityCron
    ) {}
  
  @OnlyRegistered()
  @Get('activities/:page')
  async notificationsRead(@CurrentUser() user: User, @Param('page') page: string) : Promise<ActivityDtoOut[]> {
    return this.activityService.findNotificationsByUserId(user.id, user.locale, page ? page : 0);
  }

  @OnlyRegistered()
  @Get('activities/button/:buttonId/:consumerId/:page')
  async activityButton(@CurrentUser() user: User, @Param('buttonId') buttonId: string, @Param('consumerId') consumerId: string, @Param('page') page: string) : Promise<ActivityDtoOut[]> {
    return this.activityService.findNotificationByButtonAndUser(user.id, buttonId, consumerId, user.locale, page ? page : 0);
  }
  
  @OnlyRegistered()
  @Post('sendMessage/:buttonId/:consumerId')
  async sendMessage(@CurrentUser() user: User, @Body() message: MessageDto, @Param('buttonId') buttonId: string,  @Param('consumerId') consumerId: string){
    return this.activityService.sendMessage(user.id, consumerId, buttonId, message.message)
  }

  @OnlyRegistered()
  @Post('markAsRead/:notificationId')
  async markAsRead(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: User,
  ) {
    return await this.activityService.markAsRead(user.id, notificationId);
  }


  @AllowGuest()
  @Get('network')
  async findNetworkActivity(@Query('lang') locale: string = 'en'){
    return []
    // return await this.activityService.findNetworkActivity(locale)
  }

  // @Get('triggerNotifications')
  // async triggerNotifications()
  // {
  //   return await this.activityCron.triggerNotifications()
  // }
}
