import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserCredentialService } from './user-credential.service';
import { UserCredentialController } from './user-credential.controller';
import { UserCredentialRepository } from './user-credential-repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredentialRepository])],
  controllers: [UserCredentialController],
  providers: [UserCredentialService],
  exports: [UserCredentialService],
})
export class UserCredentialModule {}
