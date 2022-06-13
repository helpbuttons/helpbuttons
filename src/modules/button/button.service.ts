import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateButtonDto,UpdateButtonDto } from './button.dto';
import { Button } from './button.entity';
import { getManager } from "typeorm";
import { NetworkService } from '../network/network.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    private readonly tagService: TagService,
    private readonly networkService: NetworkService,
    private readonly storageService: StorageService) {
  }

  async create(createDto: CreateButtonDto, networkId: string, images: File[]) {
    const network = await this.networkService.findOne(networkId);
    
    if (!network) {
      throw new HttpException({message: 'Network not found'}, HttpStatus.BAD_REQUEST)
    }
    
    let button = {
      id: dbIdGenerator(),
      description: createDto.description,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: createDto.tags,
      location: () => `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
      network: network,
      images: []
    }
    
    await getManager().transaction(async transactionalEntityManager => {
      if (Array.isArray(button.tags)) {
        await this.tagService.addTags('button', button.id, button.tags).catch(err => {
          console.log(`Error adding tags ${JSON.stringify(button.tags)} to button ${button.id}`)
          throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST)
        });
      }
      
      if (Array.isArray(images) && images.length > 0) {
        button.images = await Promise.all(images.map( async (imageFile) => {
          return await (await this.storageService.newImage(imageFile));
        }));
      }
      
      await this.buttonRepository.insert([button]);
    });
    
    return button;
  }

  findOne(id: string) {
    return this.buttonRepository.findOne({id});
  }

  update(id: string, updateDto: UpdateButtonDto) {

    let location = {};

    if (updateDto.latitude > 0 && updateDto.longitude > 0)
    {
      location = {location: () => `ST_MakePoint(${updateDto.latitude}, ${updateDto.longitude})`};
    }else {
      delete updateDto.latitude
      delete updateDto.longitude
    }

    let button = {
      ...updateDto,
      ...location,
      id
    }
    
    if (button.tags) {
      this.tagService.updateTags('button', button.id, button.tags)
    }

    return this.buttonRepository.save([button]);
  }

  findAll() {
    return this.buttonRepository.find({
      order: {
      created_at: "DESC"
    }});
  }

  remove(id: string) {
    return this.buttonRepository.delete({id});
  }
}
  