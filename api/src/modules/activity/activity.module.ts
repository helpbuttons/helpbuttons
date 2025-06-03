import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module.js';
import { ActivityController } from './activity.controller.js';
import { Activity } from './activity.entity.js';
import { ActivityService } from './activity.service.js';
import { MailModule } from '../mail/mail.module.js';
import { ActivityCron } from './activity.cron.js';
import { NetworkModule } from '../network/network.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { ButtonModule } from '../button/button.module.js';
import { ActivityCommand } from './activity.command.js';
import { PostModule } from '../post/post.module.js';


@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    UserModule,
    MailModule,
    NetworkModule,
    ScheduleModule.forRoot(),
    ButtonModule,
    PostModule
  ],
  controllers: [
    ActivityController
  ],
  providers: [
    ActivityService,
    ActivityCron,
    ActivityCommand
  ],
  exports: [
    ActivityService
  ]
})
export class ActivityModule {}
