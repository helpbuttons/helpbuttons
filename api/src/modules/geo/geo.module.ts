import { Module, forwardRef } from '@nestjs/common';
import { GeoController } from './geo.controller.js';
import { GeoService } from './geo.service.js';
import { HttpModule } from '@nestjs/axios';
import { NetworkModule } from '../network/network.module.js';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpHelper } from '@src/shared/helpers/http.helper.js';
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    forwardRef(() => NetworkModule),
    CacheModule.register(),
    NetworkModule
  ],
  controllers: [GeoController],
  providers: [GeoService, HttpHelper],
  exports: [GeoService],
})
export class GeoModule {}
