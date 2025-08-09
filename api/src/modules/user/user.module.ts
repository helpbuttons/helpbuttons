import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { User } from './user.entity.js';
import { MailModule } from '../mail/mail.module.js';
import { InviteModule } from '../invite/invite.module.js';
import { TagModule } from '../tag/tag.module.js';
import { StorageModule } from '../storage/storage.module.js';


@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule, InviteModule, TagModule, StorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
