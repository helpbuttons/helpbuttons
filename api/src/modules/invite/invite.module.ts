import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity.js';
import { InviteService } from './invite.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Invite])],
  controllers: [],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
