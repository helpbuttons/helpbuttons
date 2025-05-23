import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpStatus } from '@src/shared/types/http-status.enum.js';

import { InjectRepository } from '@nestjs/typeorm';
import { uuid } from '@src/shared/helpers/uuid.helper.js';
import { Repository } from 'typeorm';
import { ImageFile } from './image-file.entity.js';
import { getFilesRoute, uploadDir } from './storage.utils.js';
import { ErrorName } from '@src/shared/types/error.list.js';
import * as sharp from 'sharp';
import { isImageData } from '@src/shared/helpers/imageIsFile.js';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware.js';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFilesRepository: Repository<ImageFile>,
  ) {}

  async newImage64(data64): Promise<string | void> {
    const fs = require('fs');
    let [garbage, mimetype, data, fail] = data64
      .toString()
      .match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (
      !['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(
        mimetype,
      )
    ) {
      console.log('image mimetype not allowed :: ', mimetype);
      throw ErrorName.InvalidMimetype;
    }

    const fileImageName = `${uuid()}.${
      mimetype.split('/')[1]
    }`;
    let buffer = Buffer.from(data, 'base64');

    const pathfilename = `${uploadDir}${fileImageName}`;
    return sharp(buffer)
      .resize(1024)
      .toFile(pathfilename)
      .then((result) => {
        const fileName = `${getFilesRoute}${fileImageName}`;
        return {
          id: uuid(),
          name: fileName,
          mimetype: mimetype,
          originalname: 'unknown',
        };
      })
      .then((fileImage) => {
        this.imageFilesRepository.insert([fileImage]);
        console.log('file creating: ' + fileImage.name);
        return fileImage.name;
      })
      .catch((err) => {
        if (err?.code == 'ENOENT') {
          console.log(
            'Could not upload file, do you configured an upload directory?',
          );
          throw new HttpException(
            'Need to configure upload directory?',
            HttpStatus.PRECONDITION_REQUIRED,
          );
        } else {
          console.log(err);
        }
      });
  }

  async createImage(imageFileName, imageOutputFileName, size) {
    return await sharp(imageFileName)
      .resize(size, size)
      .toFile(imageOutputFileName);
  }

  async delete(filename: string) {
    return this.imageFilesRepository
      .delete({ name: filename })
      .then(async (data) => {
        try {
          const fs = require('fs');
          console.log(`deleting ${uploadDir}${filename}`);
          return await fs.unlinkSync(
            `${uploadDir}${filename}`.replace(getFilesRoute, ''),
          );
        } catch (err) {
          console.log('could not delete ' + filename);
          console.log(err);
        }
      });
  }

  async deleteMany(filenames: string[]) {
    if (filenames.length > 0) {
      return filenames.map((filename) => this.delete(filename));
    }
  }

  storageMultipleImages(images) {
    if (images?.length > 0) {
      return Promise.all(
        images
          .filter((image) => isImageData(image))
          .map(async (image) => {
            console.log('storing image....')
            try {
              return this.newImage64(image);
            } catch (err) {
              throw new CustomHttpException(
                ErrorName.InvalidMimetype,
              );
            }
          }),
      );
    }
    return Promise.resolve([]);
  }
}
