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
  
    @Get('config')
    async config() {
      return this.networkService.getConfig()
    }

    @Get('findById')
    findDefaultNetwork() {
      return this.networkService.findDefaultNetwork();
    }

  }