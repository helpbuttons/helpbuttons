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
  @Get('search/:address')
  async new(@Param('address') address: string) {
    return await this.geoService.search(address)
  }

  @AllowGuest()
  @Get('reverse/:lat/:lng')
  async reverse(@Param('lat') lat: string, @Param('lng') lng: string, @Res() response: Response) {
    return await this.geoService.findAddress(lat,lng, response)
  }
}
