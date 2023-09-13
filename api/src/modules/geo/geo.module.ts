import { Module, forwardRef } from '@nestjs/common';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { HttpModule } from '@nestjs/axios';
import { NetworkModule } from '../network/network.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    forwardRef(() => NetworkModule),
    CacheModule.register(),
  ],
  controllers: [GeoController],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
