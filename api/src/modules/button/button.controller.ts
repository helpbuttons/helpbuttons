import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  HttpException,
} from '@nestjs/common';
import { HttpStatus } from '@src/shared/types/http-status.enum';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ApiTags } from '@nestjs/swagger';

import { CreateButtonDto, UpdateButtonDto } from './button.dto';
import { ButtonService } from './button.service';
// import { FilterButtonsOrmDto } from '../dto/requests/filter-buttons-orm.dto';
import {
  editFileName,
  imageFileFilter,
} from '../storage/storage.utils';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { User } from '../user/user.entity';
import { AllowGuest, OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { AllowIfNetworkIsPublic } from '@src/shared/decorator/privacy.decorator';
import { Role } from '@src/shared/types/roles';

@ApiTags('buttons')
@Controller('buttons')
export class ButtonController {
  constructor(
    private readonly buttonService: ButtonService
    ) {}

  @OnlyRegistered()
  @Post('new')
  @UseInterceptors(
    FilesInterceptor('images[]', 4, {
      storage: diskStorage({
        destination: process.env.UPLOADS_PATH,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(
    @Query('networkId') networkId: string,
    @UploadedFiles() images,
    @Body() createDto: CreateButtonDto,
    @CurrentUser() user: User,
  ) {
    return this.buttonService.create(
      createDto,
      networkId,
      images,
      user,
    );
  }

  @AllowGuest()
  @AllowIfNetworkIsPublic()
  @Get('/find/:networkId')
  async findAll(
    @Param('networkId') networkId: string,
    @Query('northEast_lat') northEast_lat: string,
    @Query('northEast_lng') northEast_lng: string,
    @Query('southWest_lat') southWest_lat: string,
    @Query('southWest_lng') southWest_lng: string,
  ) {
    return await this.buttonService.findAll(networkId, {
      northEast: {
        lat: northEast_lat,
        lng: northEast_lng,
      },
      southWest: {
        lat: southWest_lat,
        lng: southWest_lng,
      },
    });
  }

  @AllowGuest()
  @AllowIfNetworkIsPublic()
  @Get('findById/:buttonId')
  findOne(@Param('buttonId') buttonId: string) {
    return this.buttonService.findById(buttonId);
  }
  
  @OnlyRegistered()
  @Post('update/:buttonId')
  update(
    @Param('buttonId') buttonId: string,
    @Body() updateDto: UpdateButtonDto,
    @CurrentUser() user: User,
  ) {
    this.buttonService.isOwner(user, buttonId)
    return this.buttonService.update(buttonId, updateDto);
  }

  // only allow owner of buttonId or Admin
  @OnlyRegistered()
  @Delete('delete/:buttonId')
  async delete(
    @Param('buttonId') buttonId: string,
    @CurrentUser() user: User,
    ) {
      this.buttonService.isOwner(user, buttonId)
      const response = this.buttonService.delete(buttonId);
      return response;
  }

  
}
