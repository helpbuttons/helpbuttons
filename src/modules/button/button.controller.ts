import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateButtonDto, UpdateButtonDto } from './button.dto';
import { ButtonService } from './button.service';
// import { FilterButtonsOrmDto } from '../dto/requests/filter-buttons-orm.dto';
import { editFileName, imageFileFilter } from '../storage/storage.utils';

@ApiTags('buttons')
@Controller('buttons')
export class ButtonController {
  constructor(private readonly buttonService: ButtonService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  @UseInterceptors(FilesInterceptor('images[]', 4, {
    storage: diskStorage({
      destination: process.env.UPLOADS_PATH,
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }
  ))
  create(@Query('networkId') networkId: string,
    @UploadedFiles() images,
    @Body() createDto: CreateButtonDto,
  ) {
    return this.buttonService.create(createDto, networkId, images);
  }

  @Get('/find/')
  async findAll() {
    return await this.buttonService.findAll();
  }

  @Get('findById/:buttonId')
  findOne(@Param('buttonId') buttonId: string) {
    return this.buttonService.findOne(buttonId);
  }

  @Patch('edit/:buttonId')
  update(
    @Param('buttonId') buttonId: string,
    @Body() updateDto: UpdateButtonDto,
  ) {
    return this.buttonService.update(buttonId, updateDto);
  }

  @Delete('delete/:buttonId')
  async remove(@Param('buttonId') buttonId: string) {
    return this.buttonService.remove(buttonId);
  }
}