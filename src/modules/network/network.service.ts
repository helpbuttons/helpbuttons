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

  async findOne(id: string): Promise<Network>{
    return await this.networkRepository.findOne({id});
  }

  async findAll(): Promise<Network[]>{
    return await this.networkRepository.find();
  }
  update(id: string, updateDto: UpdateNetworkDto) {
    
    let location = {};

    if (updateDto.latitude > 0 && updateDto.longitude > 0)
    {
      location = {location: () => `ST_MakePoint(${updateDto.latitude}, ${updateDto.longitude})`};
    }else {
      delete updateDto.latitude
      delete updateDto.longitude
    }

    let network = {
      ...updateDto,
      ...location,
      id
    }
    
    if (network.tags) {
      this.tagService.updateTags('network', network.id, network.tags)
    }

    return this.networkRepository.save([network]);
  }

  remove(id: string) {
    return this.networkRepository.delete({id});
  }
}
  