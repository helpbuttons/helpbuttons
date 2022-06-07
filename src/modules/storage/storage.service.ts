import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { ImageFile } from './image-file.entity';

@Injectable()
export class StorageService {
  
  constructor(@InjectRepository(ImageFile)
  private readonly imageFilesRepository: Repository<ImageFile>,){
  }

  async newImage(file: any) {
    console.log(file)
    console.log('createing ')
    const fileimage = {
      id: dbIdGenerator(),
      name: file.filename,
      mimetype: file.mimetype,
      originalname: file.originalname,
    }
    console.log(fileimage)
    // create new file on a table...
    return await this.imageFilesRepository.insert([fileimage]);

  }
}