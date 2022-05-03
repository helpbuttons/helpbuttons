import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateNetworkDto,UpdateNetworkDto } from './network.dto';
import { Network } from './network.entity';
import { getManager } from "typeorm";

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
    private readonly tagService: TagService){
  }

  async create(createDto: CreateNetworkDto) {
    // TODO: 
    // add owner
    // validate geopoint

    let network = {
      id: dbIdGenerator(),
      name: createDto.name,
      description: createDto.description,
      url: createDto.url,
      radius: createDto.radius,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: createDto.tags,
      location: () => `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
    }
    
    await getManager().transaction(async transactionalEntityManager => {
      await this.tagService.addTags('network', network.id, createDto.tags).catch(err => {throw new HttpException({message: err.message}, HttpStatus.BAD_REQUEST)});
      
      await this.networkRepository.insert([network]);
    });
    
    return network;
  }

  findOne(id: string) {
    return `This action returns a #${id} network`;
  }

  update(id: string, updateDto: UpdateNetworkDto) {
    return `This action updates a #${id} network`;
  }

  remove(id: string) {
    return `This action removes #${id} network`;
  }
}
  