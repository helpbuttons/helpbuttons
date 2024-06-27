import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { AllowGuest, OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { ButtonService } from '../button/button.service';
import { User } from '../user/user.entity';
import { ActivityService } from './activity.service';
import { ActivityCron } from './activity.cron';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService,
    private readonly activityCron: ActivityCron
    ) {}

  @OnlyRegistered()
  @Get('find')
  async find(@CurrentUser() user: User) {
    return await this.activityService.findByUserId(user.id);
  }

  @OnlyRegistered()
  @Post('markAsRead/:notificationId')
  async markAsRead(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: User,
  ) {
    return await this.activityService.markAsRead(user.id, notificationId);
  }

  @OnlyRegistered()
  @Post('markAllAsRead')
  async markAllAsRead(@CurrentUser() user: User) {
    return await this.activityService.markAllAsRead(user.id);
  }

  @AllowGuest()
  @Get('network')
  async findNetworkActivity(){
    return await this.activityService.findNetworkActivity()
  }

  // @Get('triggerNotifications')
  // async triggerNotifications()
  // {
  //   return await this.activityCron.triggerNotifications()
  // }
}
