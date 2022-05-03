import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateButtonDto,UpdateButtonDto } from './button.dto';
import { Button } from './button.entity';
import { getManager } from "typeorm";
import { NetworkService } from '../network/network.service';

@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    private readonly tagService: TagService,
    private readonly networkService: NetworkService){
  }

  async create(createDto: CreateButtonDto, networkId: string) {
    // TODO: 
    // add tags,
    // is owner of networkId ??
    // validate geopoint
    
    const network = await this.networkService.findOne(networkId);
    
    if (!network) {
      throw new HttpException({message: 'Network not found'}, HttpStatus.BAD_REQUEST)
    }
    

    let button = {
      id: dbIdGenerator(),
      name: createDto.name,
      description: createDto.description,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: createDto.tags,
      location: () => `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
      network: network,
    }
    
    await getManager().transaction(async transactionalEntityManager => {
      await this.tagService.addTags('button', button.id, createDto.tags).catch(err => {throw new HttpException({message: err.message}, HttpStatus.BAD_REQUEST)});
      
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
  