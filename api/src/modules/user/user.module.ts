import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { MailModule } from '../mail/mail.module';
import { InviteModule } from '../invite/invite.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule, InviteModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
