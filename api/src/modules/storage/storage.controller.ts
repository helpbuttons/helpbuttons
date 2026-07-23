import {
  Controller,
  Get,
  Header,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { uploadDir } from './storage.utils';
import { StorageService } from './storage.service';
import { AllowGuest } from '@src/shared/decorator/roles.decorator';
import * as fs from 'fs';


// MINIO: https://betterprogramming.pub/upload-and-retrieve-images-by-integrating-minio-with-nestjs-419e4e629b5d

@ApiTags('Files')
@Controller('files')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  @Get('get/:imgpath')
  async get(@Param('imgpath') image, @Res() res) {
    return this.storageService.send(image, res)
  }

}
