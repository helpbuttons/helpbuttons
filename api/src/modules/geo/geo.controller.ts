import { Controller, Get, Param, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowGuest } from '@src/shared/decorator/roles.decorator';
import { GeoService } from './geo.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
@ApiTags('geo')
@Controller('geo')
@UseInterceptors(CacheInterceptor)
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @AllowGuest()
  @Get('search/full/:address')
  full(@Param('address') address: string) {
    // setTimeout(() => {},)
    
    // throw new CustomHttpException(ErrorName.InvalidUsername);
    return this.geoService.search(address)
  }

  @Get('search/limited/:address')
  limited(@Param('address') address: string) {
    // setTimeout(() => {},)
    
    // throw new CustomHttpException(ErrorName.InvalidUsername);
    return this.geoService.searchLimited(address)
  }

  @AllowGuest()
  @Get('reverse/:lat/:lng')
  reverse(@Param('lat') lat: string, @Param('lng') lng: string) {
    return this.geoService.findAddress(lat,lng)
  }
}
