import {
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { uploadDir } from './storage.utils.js';
import { StorageService } from './storage.service.js';
import { AllowGuest } from '@src/shared/decorator/roles.decorator.js';


// MINIO: https://betterprogramming.pub/upload-and-retrieve-images-by-integrating-minio-with-nestjs-419e4e629b5d

@ApiTags('Files')
@Controller('files')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('get/:imgpath')
  async get(@Param('imgpath') image, @Res() res) {
    return await res.sendFile(image, { root: uploadDir });
  }

}
