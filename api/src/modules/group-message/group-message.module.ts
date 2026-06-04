import { Module } from '@nestjs/common';
import { GroupMessageController } from './group-message.controller';
import { GroupMessageService } from './group-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './group-message.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMessage]),
    UserModule
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
