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
    @UseInterceptors(FileInterceptor('logo', {
      storage: diskStorage({
        destination: process.env.UPLOADS_PATH,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }
    ))
    // @UseInterceptors(FileInterceptor('jumbo', {
    //   storage: diskStorage({
    //     destination: process.env.UPLOADS_PATH,
    //     filename: editFileName,
    //   }),
    //   fileFilter: imageFileFilter,
    // }
    // ))
    create(@UploadedFile() logo,
    // @UploadedFile() jumbo,
      @Body() createDto: CreateNetworkDto
    ){
      return this.networkService.create(createDto, logo);
      // , jumbo);
    }
  
    @Get('find/:name')
    async findAll(@Param('name') name: string) {
      return await this.networkService.findAll(name);
    }
  
    @Get('findById/:networkId')
    findOne(@Param('networkId') networkId: string) {
      return this.networkService.findOne(networkId);
    }

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
  
    @Delete('delete/:networkId')
    async remove(@Param('networkId') networkId: string) {
      return this.networkService.remove(networkId);
    }
  }