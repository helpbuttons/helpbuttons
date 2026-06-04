import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    UseInterceptors,
    UploadedFiles,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { AllowGuest, OnlyAdmin } from '@src/shared/decorator/roles.decorator';
  import { FileFieldsUploadInterceptor, videoImageFilter } from '@src/shared/decorators/file-upload.decorator';
  
  import { CreateNetworkDto, UpdateNetworkDto } from './network.dto';
  import { NetworkService } from './network.service';
  
  @ApiTags('networks')
  @Controller('networks')
  export class NetworkController {
    constructor(private readonly networkService: NetworkService) {}
    
    @OnlyAdmin()
    @Post('new')
    @UseInterceptors(
      FileFieldsUploadInterceptor(
        [
          { name: 'logo', maxCount: 1 },
          { name: 'jumbo', maxCount: 1 },
        ],
        videoImageFilter
      )
    )
    async create(
      @Body() body: any,
      @UploadedFiles() files: { logo?: Express.Multer.File[]; jumbo?: Express.Multer.File[] },
    ){
      // Parse the JSON data field
      const createDto = JSON.parse(body.data);
      const logo = files?.logo?.length > 0 ? files.logo[0] : null;
      const jumbo = files?.jumbo?.length > 0 ? files.jumbo[0] : null;

      return await this.networkService.create(createDto, logo, jumbo);
    }

    @AllowGuest()
    @Get('findById')
    async findDefaultNetwork() {
      return await this.networkService.findDefaultNetwork();
    }

    @OnlyAdmin()
    @Get('configuration')
    async findConfig() {
      return this.networkService.findDefaultNetwork(true);
    }
    
    @OnlyAdmin()
    @Post('update')
    @UseInterceptors(
      FileFieldsUploadInterceptor(
        [
          { name: 'logo', maxCount: 1 },
          { name: 'jumbo', maxCount: 1 },
        ],
        videoImageFilter
      )
    )
    async update(
      @Body() body: any,
      @UploadedFiles() files: { logo?: Express.Multer.File[]; jumbo?: Express.Multer.File[] },
    ) {
      // Parse the JSON data field
      const updateDto = JSON.parse(body.data);
      const logo = files?.logo?.length > 0 ? files.logo[0] : null;
      const jumbo = files?.jumbo?.length > 0 ? files.jumbo[0] : null;
      return await this.networkService.update(updateDto, logo, jumbo);
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
    if([16, 32, 48, 72, 96, 144, 168, 180, 192].indexOf(resolution) > -1)
    {
      return this.networkService.getLogo(res,resolution)
    }
    throw Error('resolution not allowed')
  }
}
