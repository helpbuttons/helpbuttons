import {
  HttpException,
  Inject,
  forwardRef,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
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
import { isImageData } from '@src/shared/helpers/imageIsFile';
import { removeUndefined } from '@src/shared/helpers/removeUndefined';
import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { updateNomeclature } from '@src/shared/helpers/i18n.helper';
import { getConfig } from '@src/shared/helpers/config.helper';
import { SetupDtoOut } from '../setup/setup.entity';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
    private readonly tagService: TagService,
    private readonly storageService: StorageService,
    @Inject(forwardRef(() => UserService))
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
      locale: createDto.locale,
      currency: createDto.currency,
      nomeclature: createDto.nomeclature,
      nomeclaturePlural: createDto.nomeclaturePlural,
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

  @UseInterceptors(CacheInterceptor)
  @CacheKey('defaultNetwork')
  @CacheTTL(30) // override TTL to 30 seconds
  findDefaultNetwork(): Promise<NetworkDto> {
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
        return this.entityManager
          .query(`select * from network_button_types`)
          .then((networkByButtonTypes) => {
            updateNomeclature(
              defaultNetwork.nomeclature,
              defaultNetwork.nomeclaturePlural,
            );
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
                defaultNetwork.buttonTemplates,
              ),
            };
          });
      })
      .then((network) => {
        return this.entityManager
          .query(
            `select tag,count(tag) as count from (select unnest(tags) as tag from button where expired = false AND deleted = FALSE) as tags group by tag order by count desc limit 10`,
          )
          .then((topTags) => {
            return { ...network, topTags: topTags };
          });
      })
      .then((network) => {
        // find admins...
        return this.userService
          .findAdministrators()
          .then((administrators) => {
            return { ...network, administrators };
          });
      })
      .catch((error) => {
        if (typeof error === typeof HttpException) {
          throw error;
        }
        throw new HttpException('🙆🏼‍♂️', HttpStatus.NOT_FOUND);
      });
  }

  async findOne(id: string): Promise<any> {
    return this.findDefaultNetwork();
  }

  async update(updateDto: UpdateNetworkDto) {
    const defaultNetwork = await this.findDefaultNetwork();

    const buttonsToDelete =
      await this.buttonsToDeleteFromButtonTemplates(
        defaultNetwork.buttonTemplates,
        updateDto.buttonTemplates,
      );
    if (buttonsToDelete.length > 0) {
      const message = buttonsToDelete.map(
        (btnType) =>
          `can't delete '${btnType.type}', there are already ${btnType.count} buttons with this template`,
      );
      throw new ValidationException({ buttonTemplates: message });
    }

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
      inviteOnly: updateDto.inviteOnly,
      locale: updateDto.locale,
      currency: updateDto.currency,
      nomeclature: updateDto.nomeclature,
      nomeclaturePlural: updateDto.nomeclaturePlural,
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
  
  async buttonsToDeleteFromButtonTemplates(
    currentBtnTypes,
    _newBtnTypes,
  ) {
    const networkBtnTypes = currentBtnTypes.map(
      (btnType) => btnType.name,
    );
    const newNetworkBtnTypes = _newBtnTypes.map(
      (btnType) => btnType.name,
    );

    const deletedFromNetwork = networkBtnTypes.filter((btnType) => {
      return !(newNetworkBtnTypes.indexOf(btnType) > -1);
    });
    if (deletedFromNetwork.length > 0) {
      const types = deletedFromNetwork.reduce((result, btnType) => {
        if (result.length > 0) {
          return `${result},'${btnType}'`;
        } else {
          return `'${btnType}'`;
        }
      }, '');
      const query = `select count(id), type from button where type IN (${types}) group by type`;

      return await this.entityManager.query(query);
    }
    return [];
  }

  async getButtonTemplates() {
    return this.networkRepository
      .find({ order: { created_at: 'ASC' } })
      .then((networks) => {
        return JSON.parse(networks[0].buttonTemplates);
      });
  }

  getButtonTypesWithEventField()
  {
    return this.getButtonTemplates()
      .then((buttonTemplates) => {
        return buttonTemplates
          .filter((buttonTemplate) => {
            if (!buttonTemplate.customFields) {
              return false;
            }
            const buttonTemplatesEvents =
              buttonTemplate.customFields.filter((customField) => {
                return customField.type == 'event';
              });
            if (buttonTemplatesEvents.length > 0) {
              return true;
            }
            return false;
          })
          .map((buttonTemplateEvent) => {
            return buttonTemplateEvent.name;
          });
      })
  }
}
