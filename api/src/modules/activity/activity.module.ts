import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ActivityController } from './activity.controller';
import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    UserModule,
  ],
  controllers: [
    ActivityController
  ],
  providers: [
    ActivityService
  ],
  exports: [
    ActivityService
  ]
})
export class ActivityModule {}
