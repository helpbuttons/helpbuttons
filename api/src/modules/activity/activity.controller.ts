import {
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
import { ActivityDtoOut, ActivityMessageDto } from './activity.dto';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService,
    private readonly activityCron: ActivityCron
    ) {}

  @OnlyRegistered()
  @Get('messages/search/:query')
  async messagesSearch(@CurrentUser() user: User, @Param('query') query: string) : Promise<boolean> {
    console.log('search... ' + query)
    return true;
  }

  @OnlyRegistered()
  @Get('messages/markAllAsRead')
  async messagesMarkAllAsRead(@CurrentUser() user: User) : Promise<any> {
    return this.activityService.markAllMessagesAsRead(user.id);
  }

  @OnlyRegistered()
  @Get('messages/unread')
  async messagesUnread(@CurrentUser() user: User) : Promise<ActivityMessageDto[]> {
    return this.activityService.findMessagesByUserId(user.id, user.locale, false, null);
  }
  
  @OnlyRegistered()
  @Get('messages/read/:page')
  async messagesRead(@CurrentUser() user: User, @Param('page') page: string) : Promise<ActivityMessageDto[]> {
    return this.activityService.findMessagesByUserId(user.id, user.locale, true, page ? page : 0);
  }
  

  @OnlyRegistered()
  @Get('notifications/search/:query')
  async notificationsSearch(@CurrentUser() user: User, @Param('query') query: string) : Promise<boolean> {
    console.log('search... ' + query)
    return true;
  }
  
  // @OnlyRegistered()
  // @Get('notifications/markAllAsRead')
  // async notificationsMarkAllAsRead(@CurrentUser() user: User) : Promise<any> {
  //   return this.activityService.markAllMessagesAsRead(user.id);
  // }


  // @OnlyRegistered()
  // @Get('notifications/unread')
  // async notificationsUnread(@CurrentUser() user: User) : Promise<ActivityDtoOut[]> {
  //   return this.activityService.findNotificationsByUserId(user.id, user.locale, false, null);
  // }
  
  @OnlyRegistered()
  @Get('notifications/:page')
  async notificationsRead(@CurrentUser() user: User, @Param('page') page: string) : Promise<ActivityDtoOut[]> {
    return this.activityService.findNotificationsByUserId(user.id, user.locale, null, page ? page : 0);
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
    return await this.activityService.findNetworkActivity(locale)
  }

  // @Get('triggerNotifications')
  // async triggerNotifications()
  // {
  //   return await this.activityCron.triggerNotifications()
  // }
}
