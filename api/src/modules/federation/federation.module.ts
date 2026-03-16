import { Module } from '@nestjs/common';
import { FederationService } from './federation.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [FederationService],
  exports: [FederationService],
})
export class FederationModule {}

