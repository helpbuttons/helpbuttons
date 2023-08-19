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
  
  }