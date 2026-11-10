import { Module } from '@nestjs/common';
import { GroupMessageController } from './group-message.controller';
import { GroupMessageService } from './group-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './group-message.entity';
import { UserModule } from '../user/user.module';
import { PushNotifcationModule } from '../push-notification/push-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMessage]),
    UserModule,
    PushNotifcationModule
  ],
  controllers: [
    GroupMessageController
  ],
  providers: [
    GroupMessageService
  ],
  exports: [
    GroupMessageService
  ]
})
export class GroupMessageModule {}
