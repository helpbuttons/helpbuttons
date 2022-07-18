import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ILike, Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateNetworkDto,UpdateNetworkDto } from './network.dto';
import { Network } from './network.entity';
import { getManager } from "typeorm";
import { StorageService } from '../storage/storage.service';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
    private readonly tagService: TagService,
    private readonly storageService: StorageService) {
  }

  async create(createDto: CreateNetworkDto, avatar: File) {
    // TODO: 
    // add owner
    // validate geopoint
    createDto.radius = createDto.radius ? createDto.radius : 1;
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
      avatar: '',
    }
    
    await getManager().transaction(async transactionalEntityManager => {
      if (Array.isArray(createDto.tags))
      {
        await this.tagService.addTags('network', network.id, createDto.tags).catch(err => {throw new HttpException({message: err.message}, HttpStatus.BAD_REQUEST)});
      }
      
      
      // console.log(avatar);
      if (typeof avatar !== 'undefined') {
        network.avatar = await this.storageService.newImage(avatar);
      }
      await this.networkRepository.insert([network]);
    });
    
    return network;
  }

  async findOne(id: string): Promise<Network>{
    const network = await this.networkRepository.findOne({id});
    if (!network) {
      throw new NotFoundException('Network not found');
    }
    return network;
  }

  async findAll(name: string): Promise<Network[]>{
    return await this.networkRepository.find({
      name: ILike(`%${name}%`)
    });
  }

  async findDefaultNetwork(): Promise<Network>{
    const defaultNetwork = await this.networkRepository.findOne({order: {created_at: "ASC"}});
    if (!defaultNetwork)
    {
      throw new NotFoundException('Default network not found');
    }
    return defaultNetwork;
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
  