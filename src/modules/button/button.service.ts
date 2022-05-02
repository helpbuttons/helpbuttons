import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateButtonDto,UpdateButtonDto } from './button.dto';
import { Button } from './button.entity';
import { getManager } from "typeorm";

@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    private readonly tagService: TagService){
  }

  async create(createButtonDto: CreateButtonDto) {
    // TODO: 
    // add tags,
    // is owner of networkId ??
    // validate geopoint

    let button = {
      id: dbIdGenerator(),
      name: createButtonDto.name,
      description: createButtonDto.description,
      latitude: createButtonDto.latitude,
      longitude: createButtonDto.longitude,
      tags: createButtonDto.tags,
      location: () => `ST_MakePoint(${createButtonDto.latitude}, ${createButtonDto.longitude})`,
    }
    
    await getManager().transaction(async transactionalEntityManager => {
      await this.tagService.addTags('button', button.id, createButtonDto.tags).catch(err => {throw new HttpException({message: err.message}, HttpStatus.BAD_REQUEST)});
      
      await this.buttonRepository.insert([button]);
    });
    
    return button;
  }

  findOne(id: string) {
    return `This action returns a #${id} button`;
  }

  update(id: string, updateButtonDto: UpdateButtonDto) {
    return `This action updates a #${id} button`;
  }

  remove(id: string) {
    return `This action removes #${id} button`;
  }
}
  