import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/shared/decorator/auth.decorator';
import { editFileName, imageFileFilter, uploadDir } from './storage.utils';
import { StorageService } from './storage.service';


// MINIO: https://betterprogramming.pub/upload-and-retrieve-images-by-integrating-minio-with-nestjs-419e4e629b5d

@ApiTags('Files')
@Controller('files')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('get/:imgpath')
  get(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: uploadDir });
  }

}
