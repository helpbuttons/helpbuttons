import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { ImageFile } from './image-file.entity';
import { writeFilePromise } from '@src/shared/helpers/io.helper';
import { getFilesRoute, uploadDir } from './storage.utils';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';
import { ValidationError } from 'class-validator';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFilesRepository: Repository<ImageFile>,
  ) {}


  async newImage64(data64) : Promise<string | void> {
    const fs = require('fs');
    let [garbage, mimetype, data, fail] = data64
      .toString()
      .match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (
      !(['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(mimetype))
    ) {
      console.log('image mimetype not allowed :: ', mimetype);
      throw new Error(`invalid-mimetype-${mimetype}`);
    }

    const fileImageName = `${dbIdGenerator()}.${
      mimetype.split('/')[1]
    }`;
    let buffer = Buffer.from(data, 'base64');


    return writeFilePromise(`./${uploadDir}${fileImageName}`, buffer)
    .then((fileName :string) => {
      console.log(fileName.split('/'))
      fileName = `${getFilesRoute}${fileName.split('/')[3]}`;
      
      return {
        id: dbIdGenerator(),
        name: fileName,
        mimetype: mimetype,
        originalname: 'unknown',
      }
    })
    .then((fileImage ) => {
      this.imageFilesRepository.insert([fileImage]);
      console.log('file creating: ' + fileImage.name)
      return fileImage.name;
    })
    .catch((err) => {
      if (err?.code == 'ENOENT') {
        console.log(
          'Could not upload file, do you configured an upload directory?',
        );
        throw new HttpException('Need to configure upload directory?', HttpStatus.PRECONDITION_REQUIRED)
      }
    })
    
  }
}
