import { Controller, Get, Param, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowGuest } from '@src/shared/decorator/roles.decorator';
import { GeoService } from './geo.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';
@ApiTags('geo')
@Controller('geo')
@UseInterceptors(CacheInterceptor)
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @AllowGuest()
  @Get('search/:latCenter/:lngCenter/:query')
  new(@Param('latCenter') latCenter: string, @Param('lngCenter') lngCenter: string, @Param('query') query: string) {
    return this.geoService.search(latCenter, lngCenter, query)
  }

  @AllowGuest()
  @Get('reverse/:lat/:lng')
  reverse(@Param('lat') lat: string, @Param('lng') lng: string) {
    return this.geoService.findAddress(lat,lng)
  }
}
