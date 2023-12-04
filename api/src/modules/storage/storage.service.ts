import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpStatus } from '@src/shared/types/http-status.enum';

import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { ImageFile } from './image-file.entity';
import { getFilesRoute, uploadDir } from './storage.utils';
import { ErrorName } from '@src/shared/types/error.list';
import * as sharp from 'sharp';

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
      throw ErrorName.InvalidMimetype;
    }

    const fileImageName = `${dbIdGenerator()}.${
      mimetype.split('/')[1]
    }`;
    let buffer = Buffer.from(data, 'base64');

    const fileName = `${uploadDir}${fileImageName}`
    return sharp(buffer)
    .resize(1024)
    .toFile(fileName)
    .then((result :string) => {
      const fileName = `${getFilesRoute}${fileImageName}`;
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
      }else{
        console.log(err)
      }
    })
    
  }
}
