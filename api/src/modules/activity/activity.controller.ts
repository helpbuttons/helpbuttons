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
import { Activities, ActivityDtoOut, MessageDto } from './activity.dto';
import { ButtonService } from '../button/button.service';
import { UserService } from '../user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { notifyUser } from '@src/app/app.event';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly buttonService: ButtonService,
    private readonly userService: UserService,
    private readonly activityCron: ActivityCron,
    private eventEmitter: EventEmitter2
    ) {}
  
  @OnlyRegistered()
  @Get('activities/:page')
  async notificationsRead(@CurrentUser() user: User, @Param('page') page: number) : Promise<Activities> {
    return this.activityService.findNotificationsByUser(user, page ? page : 0);
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
    .then((insertresult) => {
      return this.buttonService.follow(buttonId, user.id).then((button) => {
        return this.userService.follow(buttonId, user.id)
        .then((user) => {
          if(button){
            notifyUser(this.eventEmitter,ActivityEventName.NewFollowingButton,{button, user})
          }
        })
      })
    })
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

  @Get('triggerNotifications')
  async triggerNotifications()
  {
    return await this.activityCron.triggerNotifications()
  }
}
