import { Module, forwardRef } from '@nestjs/common';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { HttpModule } from '@nestjs/axios';
import { NetworkModule } from '../network/network.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpHelper } from '@src/shared/helpers/http.helper';
import { KeyLocationService } from './keylocation.service';
import { KeyLocation } from './keylocation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    forwardRef(() => NetworkModule),
    CacheModule.register(),
    NetworkModule,
    TypeOrmModule.forFeature([KeyLocation])
  ],
  controllers: [GeoController],
  providers: [GeoService, KeyLocationService, HttpHelper],
  exports: [GeoService],
})
export class GeoModule {}
