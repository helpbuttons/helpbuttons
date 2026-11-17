import { Module } from '@nestjs/common';
import { FederationService } from './federation.service';
import { UserModule } from '../user/user.module';
import { StorageModule } from '../storage/storage.module';
import { ButtonModule } from '../button/button.module';

@Module({
  imports: [UserModule, StorageModule, ButtonModule],
  providers: [FederationService],
  exports: [FederationService],
})
export class FederationModule {}

