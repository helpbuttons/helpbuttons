import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialService } from './user-credential.service.js';
import { UserCredential } from './user-credential.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredential])],
  providers: [UserCredentialService],
  exports: [UserCredentialService],
})
export class UserCredentialModule {}
