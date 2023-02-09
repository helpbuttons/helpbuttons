import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ClassSerializerInterceptor,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../storage/storage.utils';
  
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
    
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('findById')
    findDefaultNetwork() {
      return this.networkService.findDefaultNetwork();
    }
  
    @Patch('edit/:networkId')
    update(
      @Param('networkId') networkId: string,
      @Body() updateNetworkDto: UpdateNetworkDto,
    ) {
      return this.networkService.update(networkId, updateNetworkDto);
    }
  
  }