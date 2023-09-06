import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatus } from '@src/shared/types/http-status.enum';

import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { EntityManager, ILike, Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import {
  CreateNetworkDto,
  NetworkDto,
  UpdateNetworkDto,
} from './network.dto';
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
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(createDto: CreateNetworkDto) {
    const network = {
      id: dbIdGenerator(),
      description: createDto.description,
      // url: createDto.url,
      tags: this.tagService.formatTags(createDto.tags),
      privacy: createDto.privacy,
      logo: null,
      jumbo: null,
      name: createDto.name,
      exploreSettings: createDto.exploreSettings,
      backgroundColor: createDto.backgroundColor,
      textColor: createDto.textColor,
      buttonTemplates: JSON.stringify(createDto.buttonTemplates),
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
      })
      .then((defaultNetwork) => {
        return this.userService
          .findAdministrator()
          .then((administrator: User) => {
            return { ...defaultNetwork, administrator };
          });
      })
      .then((defaultNetwork) => {
        return this.entityManager
          .query(`select * from network_button_types`)
          .then((networkByButtonTypes) => {
            return {
              ...defaultNetwork,
              buttonTypesCount: networkByButtonTypes,
              exploreSettings: JSON.parse(
                defaultNetwork.exploreSettings,
              ),
              buttonCount: networkByButtonTypes.reduce(
                (totalCount, buttonType) =>
                  totalCount + parseInt(buttonType.count),
                0,
              ),
              buttonTemplates: JSON.parse(
                defaultNetwork.buttonTemplates
              ),
            };
          });
      })
      .catch((error) => {
        console.log(error)
        if (typeof error === typeof HttpException) {
          throw error;
        }
        throw new HttpException('🙆🏼‍♂️', HttpStatus.NOT_FOUND);
      });
  }

  async findOne(id: string): Promise<Network> {
    return this.findDefaultNetwork();
  }

  async update(updateDto: UpdateNetworkDto) {
    const defaultNetwork = await this.findDefaultNetwork();
    
    const network = {
      id: defaultNetwork.id,
      description: updateDto.description,
      // url: createDto.url,
      tags: this.tagService.formatTags(updateDto.tags),
      privacy: updateDto.privacy,
      logo: null,
      jumbo: null,
      name: updateDto.name,
      exploreSettings: updateDto.exploreSettings,
      backgroundColor: updateDto.backgroundColor,
      textColor: updateDto.textColor,
      buttonTemplates: JSON.stringify(updateDto.buttonTemplates),
      inviteOnly: updateDto.inviteOnly
    };
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

        if (isImageData(updateDto.logo)) {
          try {
            network.logo = await this.storageService.newImage64(
              updateDto.logo,
            );
          } catch (err) {
            throw new ValidationException({ logo: err.message });
          }
        }

        if (isImageData(updateDto.jumbo)) {
          try {
            network.jumbo = await this.storageService.newImage64(
              updateDto.jumbo,
            );
          } catch (err) {
            throw new ValidationException({ jumbo: err.message });
          }
        }

        await this.networkRepository.update(
          defaultNetwork.id,
          removeUndefined(network),
        );
      },
    );

    return network;
  }

  getConfig(): Promise<SetupDtoOut> {
    return getConfig();
  }
}
