import {
    Controller,
    Get,
    Post,
    Body,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
import { AllowedRoles, AllowGuest, OnlyAdmin } from '@src/shared/decorator/roles.decorator';
import { Role } from '@src/shared/types/roles';
  
  import { CreateNetworkDto, UpdateNetworkDto } from './network.dto';
  import { NetworkService } from './network.service';
  // import { FilterNetworksOrmDto } from '../dto/requests/filter-networks-orm.dto';
  
  @ApiTags('networks')
  @Controller('networks')
  export class NetworkController {
    constructor(private readonly networkService: NetworkService) {}
  
    @Post('new')
    create(@Body() createDto: CreateNetworkDto
    ){
      return this.networkService.create(createDto);
    }

    @AllowGuest()
    @Get('findById')
    findDefaultNetwork() {
      return this.networkService.findDefaultNetwork();
    }
    
    @OnlyAdmin()
    @Post('update')
    update(
      @Body() updateNetworkDto: UpdateNetworkDto,
    ) {
      return this.networkService.update(updateNetworkDto);
    }

    @AllowGuest()
    @Get('config')
    async config() {
      return this.networkService.getConfig()
    }
  
  }