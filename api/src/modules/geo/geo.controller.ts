import {  Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowGuest } from '@src/shared/decorator/roles.decorator';
import { GeoService } from './geo.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
@ApiTags('geo')
@Controller('geo')
@UseInterceptors(CacheInterceptor)
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000*60*60)
  @Get('search/full/:lat/:lon/:address')
  full(@Param('address') address: string, @Param('lat') lat: string, @Param('lon') lon: string) {
    return this.geoService.search(address, lat, lon)
  }

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000*60*60)
  @Get('search/limited/:lat/:lon/:address')
  limited(@Param('address') address: string, @Param('lat') lat: string, @Param('lon') lon: string) {
    return this.geoService.searchLimited(address, lat, lon)
  }

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000*60*60)
  @Get('reverse/full/:lat/:lon')
  reverse(@Param('lat') lat: string, @Param('lon') lon: string) {
    return this.geoService.findAddress(lat,lon)
  }

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000*60*60)
  @Get('reverse/limited/:lat/:lon')
  reverseLimited(@Param('lat') lat: string, @Param('lon') lon: string) {
    return this.geoService.findAddressLimited(lat,lon)
  }
}
