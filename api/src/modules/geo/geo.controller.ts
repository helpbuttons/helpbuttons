import { CacheTTL, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowGuest } from '@src/shared/decorator/roles.decorator';
import { GeoService } from './geo.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
@ApiTags('geo')
@Controller('geo')
@UseInterceptors(CacheInterceptor)
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60*60*24)
  @Get('search/full/:address')
  full(@Param('address') address: string) {
    // setTimeout(() => {},)
    
    // throw new CustomHttpException(ErrorName.InvalidUsername);
    return this.geoService.search(address)
  }

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60*60*24)
  @Get('search/limited/:address')
  limited(@Param('address') address: string) {
    // setTimeout(() => {},)
    
    // throw new CustomHttpException(ErrorName.InvalidUsername);
    return this.geoService.searchLimited(address)
  }

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60*60*24)
  @Get('reverse/full/:lat/:lng')
  reverse(@Param('lat') lat: string, @Param('lng') lng: string) {
    return this.geoService.findAddress(lat,lng)
  }

  @AllowGuest()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60*60*24)
  @Get('reverse/limited/:lat/:lng')
  reverseLimited(@Param('lat') lat: string, @Param('lng') lng: string) {
    return this.geoService.findAddressLimited(lat,lng)
  }
}
