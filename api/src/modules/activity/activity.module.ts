import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ActivityController } from './activity.controller';
import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';
import { MailModule } from '../mail/mail.module';
import { ActivityCron } from './activity.cron';


@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    UserModule,
    MailModule
  ],
  controllers: [
    ActivityController
  ],
  providers: [
    ActivityService,
    ActivityCron
  ],
  exports: [
    ActivityService
  ]
})
export class ActivityModule {}
