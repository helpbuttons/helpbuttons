import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowGuest } from '@src/shared/decorator/roles.decorator';
import { GeoService } from './geo.service';

@ApiTags('geo')
@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @AllowGuest()
  @Get('search/:address')
  async new(@Param('address') address: string) {
    return await this.geoService.search(address)
  }

  @AllowGuest()
  @Get('reverse/:lat/:lng')
  async reverse(@Param('lat') lat: string, @Param('lng') lng: string) {
    return await this.geoService.reverse(lat,lng)
  }
}
