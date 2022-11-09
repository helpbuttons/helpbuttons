import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredentialService } from './user-credential.service';
import { UserCredential } from './user-credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredential])],
  providers: [UserCredentialService],
  exports: [UserCredentialService],
})
export class UserCredentialModule {}
