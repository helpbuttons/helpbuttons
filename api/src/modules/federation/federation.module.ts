import { Module } from '@nestjs/common';
import { FederationController } from './federation.controller';
import { FederationService } from './federation.service';
import { UserModule } from '../user/user.module';
import { NetworkModule } from '../network/network.module';

@Module({
  imports: [
    UserModule,
    NetworkModule
  ],
  controllers: [
    FederationController
  ],
  providers: [
    FederationService
  ],
  exports: [
    FederationService
  ]
})
export class FerderationModule {}
