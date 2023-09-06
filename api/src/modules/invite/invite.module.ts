import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity';
import { InviteService } from './invite.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invite])],
  controllers: [],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
