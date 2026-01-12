import { Module } from '@nestjs/common';
import { GroupMessageController } from './group-message.controller';
import { GroupMessageService } from './group-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from './group-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMessage]),
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
