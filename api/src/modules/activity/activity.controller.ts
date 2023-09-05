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
import { OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { ButtonService } from '../button/button.service';
import { User } from '../user/user.entity';
import { ActivityService } from './activity.service';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

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
}
