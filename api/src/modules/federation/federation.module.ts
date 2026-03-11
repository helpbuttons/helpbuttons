
import { Module } from '@nestjs/common';
import { FederationService } from './federation.service';

@Module({
  providers: [FederationService],
  exports: [FederationService],
})
export class FederationModule {}