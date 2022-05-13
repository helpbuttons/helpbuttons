import { Module } from '@nestjs/common';
import { UserCredentialService } from './user-credential.service';
import { UserCredentialController } from './user-credential.controller';

@Module({
  controllers: [UserCredentialController],
  providers: [UserCredentialService]
})
export class UserCredentialModule {}
