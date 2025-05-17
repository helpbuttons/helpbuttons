import { Controller, Get, Header, Param, Query, Req} from '@nestjs/common';
import { AllowGuest } from '@src/shared/decorator/roles.decorator';
import { FederationService } from './federation.service';

@Controller('federation')
export class FederationController {
  constructor(
    private readonly federationService: FederationService,
  ) {}

  @Header('Content-Type', 'application/json')
  @AllowGuest()
  @Get('/.well-known/webfinger')
  async webfinger(@Req() req: Request, @Query('resource') resource: string){
    const host = req.headers
    return this.federationService.webfinger(resource)
  }
  
  @Header('Content-Type', 'application/json')
  @AllowGuest()
  @Get('/users/:username')
  async users(@Param('username') username: string){
    return this.federationService.users(username)
  }
}