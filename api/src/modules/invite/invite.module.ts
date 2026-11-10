import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity';
import { InviteService } from './invite.service';
import { NetworkModule } from '../network/network.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invite]),NetworkModule],
  controllers: [],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
