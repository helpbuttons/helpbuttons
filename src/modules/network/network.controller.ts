import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  
  import { CreateNetworkDto, UpdateNetworkDto } from './network.dto';
  import { NetworkService } from './network.service';
  // import { FilterNetworksOrmDto } from '../dto/requests/filter-networks-orm.dto';
  
  @ApiTags('networks')
  @Controller('networks')
  export class NetworkController {
    constructor(private readonly networkService: NetworkService) {}
  
    @Post('new')
    create(@Body() createDto: CreateNetworkDto) {
      return this.networkService.create(createDto);
    }
  
    @Get('find')
    async findAll() {
      return await this.networkService.findAll();
    }
  
    @Get('findById/:networkId')
    findOne(@Param('networkId') networkId: string) {
      return this.networkService.findOne(networkId);
    }
  
    @Patch('edit/:networkId')
    update(
      @Param('networkId') networkId: string,
      @Body() updateNetworkDto: UpdateNetworkDto,
    ) {
      return this.networkService.update(networkId, updateNetworkDto);
    }
  
    @Delete('delete/:networkId')
    async remove(@Param('networkId') networkId: string) {
      return this.networkService.remove(networkId);
    }
  }