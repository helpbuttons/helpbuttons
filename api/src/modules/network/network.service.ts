import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ILike, Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateNetworkDto, UpdateNetworkDto } from './network.dto';
import { Network } from './network.entity';
import { getManager } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';
import { UserService } from '../user/user.service';
import { SetupDtoOut } from '../setup/setup.entity';
import { getConfig } from '@src/shared/helpers/config.helper';

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
    createDto.radius = createDto.radius ? createDto.radius : 1;
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
  
  findDefaultNetwork(): Promise<Network> {
    return this.networkRepository
      .find({ order: { created_at: 'ASC' } })
      .then((networks) => {
        if (networks.length < 1) {
          throw new HttpException(
            'Default network not found',
            HttpStatus.NOT_FOUND,
          );
        }
        return this.userService.findAdministrator().then(
          (admin) => {
            return {...networks[0], administrator: admin};
          }
        )
      })
      .catch((error) => {
        if (typeof error === typeof HttpException) {
          throw error;
        }
        throw new HttpException('🙆🏼‍♂️', HttpStatus.NOT_FOUND);
      });
  }


  getConfig(): Promise<SetupDtoOut> {
    return getConfig();
  }


  async findOne(id: string): Promise<Network> {
    return this.findDefaultNetwork()
  }
}