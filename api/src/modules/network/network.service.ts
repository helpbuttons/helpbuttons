import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpStatus } from '@src/shared/types/http-status.enum';

import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ILike, Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateNetworkDto, NetworkDto, UpdateNetworkDto } from './network.dto';
import { Network } from './network.entity';
import { getManager } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { SetupDtoOut } from '../setup/setup.entity';
import { getConfig } from '@src/shared/helpers/config.helper';
import { isImageData } from '@src/shared/helpers/imageIsFile';
import { removeUndefined } from '@src/shared/helpers/removeUndefined';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
    private readonly tagService: TagService,
    private readonly storageService: StorageService,
    private readonly userService: UserService,
  ) {}

  async create(createDto: CreateNetworkDto) {
    const network = {
      id: dbIdGenerator(),
      description: createDto.description,
      // url: createDto.url,
      radius: createDto.radius,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: createDto.tags,
      privacy: createDto.privacy,
      location: () =>
        `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
      logo: null,
      jumbo: null,
      zoom: createDto.zoom,
      name: createDto.name,
      address: createDto.address,
      resolution: createDto.resolution,
      hexagons: createDto.hexagons,
      tiletype: createDto.tiletype
    };
    await getManager().transaction(
      async (transactionalEntityManager) => {
        if (Array.isArray(createDto.tags)) {
          await this.tagService
            .addTags('network', network.id, createDto.tags)
            .catch((err) => {
              throw new HttpException(
                { message: err.message },
                HttpStatus.BAD_REQUEST,
              );
            });
        }

        try {
          network.logo = await this.storageService.newImage64(
            createDto.logo,
          );
        } catch (err) {
          throw new ValidationException({ logo: err.message });
        }

        try {
          network.jumbo = await this.storageService.newImage64(
            createDto.jumbo,
          );
        } catch (err) {
          console.log(`errorjumboooooror: ${err.message}`);
          throw new ValidationException({ jumbo: err.message });
        }
        console.log(
          `network.logo ${network.logo} jumbo ${network.jumbo}`,
        );
        await this.networkRepository.insert([network]);
      },
    );

    return network;
  }

  async findAll(name: string): Promise<Network[]> {
    return await this.networkRepository.find({
      where: { name: ILike(`%${name}%`) },
    });
  }

  findDefaultNetwork(): Promise<NetworkDto> {
    // const

    return this.networkRepository
      .find({ order: { created_at: 'ASC' } })
      .then((networks) => {
        if (networks.length < 1) {
          throw new HttpException(
            'Default network not found',
            HttpStatus.NOT_FOUND,
          );
        }
        return networks[0];
      }).then((defaultNetwork) => {
        return this.userService.findAdministrator().then((administrator :User) => {
          return {...defaultNetwork,  administrator }
        })
      })
      .catch((error) => {
        if (typeof error === typeof HttpException) {
          throw error;
        }
        throw new HttpException('🙆🏼‍♂️', HttpStatus.NOT_FOUND);
      });
  }

  async findOne(id: string): Promise<Network> {
    return this.findDefaultNetwork()
  }


  async update(updateDto: UpdateNetworkDto){
    const defaultNetwork = await this.findDefaultNetwork();

    const network = {
      id: defaultNetwork.id,
      description: updateDto.description,
      // url: createDto.url,
      radius: updateDto.radius,
      latitude: updateDto.latitude,
      longitude: updateDto.longitude,
      tags: updateDto.tags,
      privacy: updateDto.privacy,
      location: () =>
        `ST_MakePoint(${updateDto.latitude}, ${updateDto.longitude})`,
      logo: null,
      jumbo: null,
      zoom: updateDto.zoom,
      name: updateDto.name,
      address: updateDto.address,
      resolution: updateDto.resolution,
      hexagons: updateDto.hexagons,
      tiletype: updateDto.tiletype
    } ;
    await getManager().transaction(
      async (transactionalEntityManager) => {
        if (Array.isArray(updateDto.tags)) {
          await this.tagService
            .addTags('network', network.id, updateDto.tags)
            .catch((err) => {
              throw new HttpException(
                { message: err.message },
                HttpStatus.BAD_REQUEST,
              );
            });
        }

        if (isImageData(updateDto.logo))
        {
          try {
            network.logo = await this.storageService.newImage64(
              updateDto.logo,
            );
          } catch (err) {
            throw new ValidationException({ logo: err.message });
          }
        }
        
        if (isImageData(updateDto.jumbo))
        {
          try {
            network.jumbo = await this.storageService.newImage64(
              updateDto.jumbo,
            );
          } catch (err) {
            throw new ValidationException({ jumbo: err.message });
          }
        }

        await this.networkRepository.update(defaultNetwork.id, removeUndefined(network));
      },
    );

    return network;
  }

  getConfig(): Promise<SetupDtoOut> {
    return getConfig();
  }
}