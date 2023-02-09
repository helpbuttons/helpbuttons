import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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


  getConfig(): Promise<SetupDtoOut> {
    return getConfig();
  }
}