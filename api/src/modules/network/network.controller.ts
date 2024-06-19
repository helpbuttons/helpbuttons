import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
import { AllowGuest, OnlyAdmin } from '@src/shared/decorator/roles.decorator';
  
  import { CreateNetworkDto, UpdateNetworkDto } from './network.dto';
  import { NetworkService } from './network.service';
  // import { FilterNetworksOrmDto } from '../dto/requests/filter-networks-orm.dto';
  
  @ApiTags('networks')
  @Controller('networks')
  export class NetworkController {
    constructor(private readonly networkService: NetworkService) {}
    
    @OnlyAdmin()
    @Post('new')
    async create(@Body() createDto: CreateNetworkDto
    ){
      return await this.networkService.create(createDto);
    }

    @AllowGuest()
    @Get('findById')
    async findDefaultNetwork() {
      return await this.networkService.findDefaultNetwork();
    }
    
    @OnlyAdmin()
    @Post('update')
    async update(
      @Body() updateNetworkDto: UpdateNetworkDto,
    ) {
      return await this.networkService.update(updateNetworkDto);
    }
  

    @AllowGuest()
    @Get('config')
    async config() {
      return await this.networkService.getConfig()
    }

  @AllowGuest()
  @Get('manifest.json')
  async manifest() {
    return await this.networkService.manifest();
  }

  @AllowGuest()
  @Get('logo/:resolution')
  async logo(@Param('resolution') resolution : number, @Res() res) {
    if([16, 32, 48, 72, 96, 144, 168, 192].indexOf(resolution) > -1)
    {
      return this.networkService.getLogo(res,resolution)
    }
    throw Error('resolution not allowed')
  }
}
