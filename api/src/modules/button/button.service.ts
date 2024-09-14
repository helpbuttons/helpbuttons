import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import {
  Repository,
  In,
  EntityManager,
  Not,
  Between,
  LessThan,
} from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateButtonDto, UpdateButtonDto } from './button.dto';
import { Button } from './button.entity';
import { getManager } from 'typeorm';
import { NetworkService } from '../network/network.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/user.entity';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';
import { Role } from '@src/shared/types/roles';
import {
  isImageData,
  isImageUrl,
} from '@src/shared/helpers/imageIsFile';
import { maxResolution } from '@src/shared/types/honeycomb.const';
import { PostService } from '../post/post.service';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { ActivityEventName } from '@src/shared/types/activity.list';
import * as fs from 'fs';
import translate, {
  readableDate,
} from '@src/shared/helpers/i18n.helper';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { getUrl } from '@src/shared/helpers/mail.helper';
import { notifyUser } from '@src/app/app.event';
// import { RRule } from 'rrule';

@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    private readonly tagService: TagService,
    private readonly networkService: NetworkService,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    createDto: CreateButtonDto,
    networkId: string,
    images: File[],
    user: User,
  ) {
    const network = await this.networkService.findOne(networkId);

    let hasPhone = false;
    if (user.phone) {
      hasPhone = true;
    }

    if (!network) {
      throw new HttpException(
        { message: 'Network not found' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const buttonTemplates = network.buttonTemplates;
    const buttonTemplate = buttonTemplates.find(
      (btnTemplate) => btnTemplate.name == createDto.type,
    );

    if (buttonTemplate?.customFields) {
      const isEvent = buttonTemplate?.customFields.find(
        (customField) => customField.type == 'event',
      );
      if (isEvent) {
        if (
          !createDto.eventEnd ||
          !createDto.eventStart ||
          !createDto.eventType
        ) {
          throw new CustomHttpException(ErrorName.invalidDates);
        }
        if (
          new Date(createDto.eventEnd).getTime() <
          new Date(createDto.eventStart).getTime()
        ) {
          throw new CustomHttpException(ErrorName.invalidDates);
        }
      }
    }
    let awaitingApproval = false;
    if (network.requireApproval && user.role != Role.admin) {
      awaitingApproval = true;
    }
    const button = {
      id: dbIdGenerator(),
      type: createDto.type,
      description: createDto.description,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: this.tagService.formatTags([
        ...createDto.tags,
        ...[buttonTemplate.caption],
      ]),
      location: () =>
        `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
      network: network,
      images: [],
      owner: user,
      image: null,
      title: createDto.title,
      address: createDto.address,
      hexagon: () =>
        `h3_lat_lng_to_cell(POINT(${createDto.longitude}, ${createDto.latitude}), ${maxResolution})`,
      hideAddress: createDto.hideAddress,
      price: createDto.price,
      eventStart: createDto.eventStart,
      eventEnd: createDto.eventEnd,
      eventType: createDto.eventType,
      hasPhone,
      eventData: createDto.eventData,
      awaitingApproval,
    };

    await getManager().transaction(
      async (transactionalEntityManager) => {
        if (Array.isArray(button.tags)) {
          await this.tagService
            .addTags('button', button.id, button.tags)
            .catch((err) => {
              console.log(
                `Error adding tags ${JSON.stringify(
                  button.tags,
                )} to button ${button.id}`,
              );
              throw new HttpException(
                { message: err.message },
                HttpStatus.BAD_REQUEST,
              );
            });
        }

        button.images =
          await this.storageService.storageMultipleImages(
            createDto.images,
          );
        if (button.images.length > 0) {
          button.image = button.images[0];
        }
        await this.buttonRepository.insert([button]);
      },
    );

    return await button;
  }

  async findById(
    id: string,
    includeExpired: boolean = false,
  ): Promise<Button> {
    let button: Button = await this.buttonRepository.findOne({
      where: { id, ...this.expiredBlockedConditions(includeExpired) },
      relations: ['owner'],
    });
    if (!button) {
      throw new HttpException(
        'button not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.checkAndSetExpired(button);
  }

  async update(
    id: string,
    updateDto: UpdateButtonDto,
    currentUser: User,
  ) {
    const currentButton = await this.findById(id, true);

    let location = {};
    let hexagon = {};
    location = {
      location: () =>
        `ST_MakePoint(${updateDto.latitude}, ${updateDto.longitude})`,
    };
    hexagon = {
      hexagon: () =>
        `h3_lat_lng_to_cell(POINT(${updateDto.longitude}, ${updateDto.latitude}), ${maxResolution})`,
    };

    let hasPhone = false;
    if (currentButton.owner.phone) {
      hasPhone = true;
    }
    const button: Partial<Button> = {
      ...updateDto,
      ...location,
      ...hexagon,
      hasPhone,
      images: [],
      id,
      tags: this.tagService.formatTags(updateDto.tags),
      expired: false,
    };

    if (button.tags) {
      await this.tagService.updateTags('button', id, button.tags);
    }

    if (updateDto.images?.length > 0) {
      await Promise.all(
        updateDto.images.map(async (image) => {
          if (isImageData(image)) {
            try {
              const newImage = await this.storageService.newImage64(
                image,
              );
              if (newImage) {
                button.images.push(newImage);
              }
            } catch (err) {
              throw new CustomHttpException(
                ErrorName.InvalidMimetype,
              );
            }
          } else if (isImageUrl(image)) {
            button.images.push(image);
          } else {
            console.error('no image data, or image url?');
            console.log(image);
          }
        }),
      );
    }
    if (button.images.length > 0) {
      button.image = button.images[0];
    }

    this.buttonRepository
      .findOne({ where: { id: id } })
      .then((storeButton) => {
        if (button.images.length < 0) {
          this.storageService.deleteMany(storeButton.images);
        } else {
          var _ = require('lodash/array');
          const deleteImages = _.difference(
            storeButton.images,
            button.images,
          );
          if (deleteImages.length > 0) {
            this.storageService.deleteMany(deleteImages);
          }
        }
      });

    return this.isEventExpired(button).then((isExpired) => {
      if (isExpired) {
        throw new CustomHttpException(ErrorName.expiredDates);
      }
      return this.buttonRepository.save([button]);
    });
  }

  async findh3(resolution, hexagons): Promise<Button[]> {
    try {
      if (hexagons && hexagons.length > 1000) {
        throw new HttpException(
          'too many hexagons requested, aborting',
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }
      const buttonsOnHexagons = await this.buttonRepository
        .createQueryBuilder('button')
        .select('id')
        .where(
          `h3_cell_to_parent(cast (button.hexagon as h3index),${resolution}) IN(:...hexagons) AND deleted = false AND expired = false AND "awaitingApproval" = false`,
          { hexagons: hexagons },
        )
        .limit(1000)
        .execute();
      const buttonsIds = buttonsOnHexagons.map((button) => button.id);

      return this.buttonRepository
        .find({
          relations: ['feed', 'owner'],
          where: {
            id: In(buttonsIds),
            ...this.expiredBlockedConditions(),
          },
          order: {
            created_at: 'DESC',
          },
        })
        .then((buttons) => {
          return Promise.all(
            buttons.map(async (button) => {
              return this.checkAndSetExpired(button);
            }),
          )
            .then((btns) => {
              return btns.filter((btn) => !btn.expired);
            })
            .then((btns) => {
              return btns.map((btn) => {
                return {
                  ...btn,
                  hasPhone: btn.owner.phone ? true : false,
                };
              });
            });
          // return Promise.all(btns)
        });
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async delete(buttonId: string) {
    return this.findById(buttonId).then((button) => {
      return this.buttonRepository
        .update(button.id, { deleted: true })
        .then((res) => {
          return button;
        });
    });
  }

  public isOwner(
    currentUser: User,
    buttonId: string,
    includeExpired: boolean = false,
  ) {
    return this.findById(buttonId, includeExpired).then((button) => {
      if (
        currentUser.role == Role.admin ||
        currentUser.id == button.owner.id
      ) {
        return true;
      }
      return false;
    });
  }

  async findAdminButton(): Promise<Button> {
    let button: Button = await this.buttonRepository.findOne({
      where: { owner: { role: Role.admin }, deleted: false },
      relations: ['owner'],
      order: {
        created_at: 'ASC',
      },
    });
    if (!button) {
      throw new HttpException(
        'button not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return button;
  }

  async findByOwner(ownerId: string) {
    let buttons: Button[] = await this.buttonRepository.find({
      where: {
        owner: { id: ownerId, role: Not(Role.blocked) },
        deleted: false,
        expired: false,
      },
      relations: ['owner'],
    });
    return buttons;
  }

  async follow(buttonId: string, userId: string) {
    const button = await this.findById(buttonId);
    const index = button.followedBy.indexOf(userId);
    if (index < 0) {
      button.followedBy.push(userId);
      return await this.buttonRepository.save(button);
    }
    return button;
  }

  async unfollow(buttonId: string, userId: string) {
    const button = await this.findById(buttonId);
    const index = button.followedBy.indexOf(userId);
    if (index > -1) {
      button.followedBy.splice(index, 1);
      return await this.buttonRepository.save(button);
    }
    return true;
  }

  async getPhone(buttonId: string) {
    const query = `SELECT public.user.phone from button, public.user WHERE button.id = '${buttonId}' AND "ownerId" = public.user.id`;
    const result = await this.entityManager.query(query);

    if (result.length > 0) {
      return result[0].phone;
    }
    return '';
  }

  findDeletedAndRemoveMedia() {
    // created more than 1 month ago
    return this.entityManager
      .query(
        `select id, images from button where deleted = true AND updated_at < now() - INTERVAL '1 month'`,
      )
      .then((buttonsDeleted) => {
        return buttonsDeleted.map((button) => {
          return this.removeMedia(button.id, button.images);
        });
      });
  }
  private removeMedia(buttonId: string, images: string[]) {
    return images.map((imagePath) => {
      const path = imagePath.replace('/files/get/', './uploads/');
      console.log('removing media: ' + path);
      return fs.unlinkSync(path);
    });
  }

  expiredBlockedConditions(includeExpired: boolean = false) {
    const blocked = {
      owner: { role: Not(Role.blocked) },
      deleted: false,
    };
    if (includeExpired) {
      return blocked;
    }
    return { expired: false, ...blocked };
  }

  @OnEvent(ActivityEventName.NewPost)
  async updateDate(payload: any) {
    const buttonId = payload.data.post.button.id;
    await this.updateModifiedDate(buttonId);
  }

  @OnEvent(ActivityEventName.NewPostComment)
  async autoFollowButton(payload: any) {
    switch (payload.activityEventName) {
      case ActivityEventName.NewPostComment:
        const buttonId = payload.data.comment.button.id;
        const userId = payload.data.comment.author.id;
        this.follow(buttonId, userId);
        break;
    }
    const buttonId = payload.data.comment.post.button.id;
    await this.updateModifiedDate(buttonId);
  }

  renew(button: Button, user: User) {
    return this.isEventExpired(button).then(async (isExpired) => {
      if (isExpired) {
        throw new CustomHttpException(ErrorName.expiredDates);
      } else {
        return this.updateModifiedDate(button.id).then(() => {
          return button;
        });
      }
    });
  }

  updateModifiedDate(buttonId: string) {
    return this.entityManager.query(
      `UPDATE button SET updated_at = CURRENT_TIMESTAMP, deleted = false, expired = false WHERE id = '${buttonId}'`,
    );
  }

  checkAndSetExpired(button: Button) {
    if (button.expired) {
      return Promise.resolve(button);
    }
    return this.isEventExpired(button).then(async (isExpired) => {
      if (isExpired) {
        await this.setExpired(button.id);
        notifyUser(
          this.eventEmitter,
          ActivityEventName.ExpiredButton,
          { button },
        );
        return { ...button, expired: true };
      }
      return button;
    });
    // deactivating to expire buttons after 3 months...
    // https://github.com/helpbuttons/helpbuttons/issues/703
    /*.then(async (button) => {
      var expiredUpdatesDate = new Date();
      expiredUpdatesDate.setMonth(expiredUpdatesDate.getMonth() - 3);
      if (button.updated_at < expiredUpdatesDate) {
        const now = new Date();
        if (button.updated_at < now) {
          await this.setExpired(button.id)
          await this.notifyOwnerExpiredButton(button)
          return {...button, expired: true};
        }
      }
      return button;
    });*/
  }

  isEventExpired(button: Partial<Button>) {
    return this.networkService
      .getButtonTypesWithEventField()
      .then((btnTemplateEvents) => {
        // if its a button type with an event field
        if (btnTemplateEvents.indexOf(button.type) > -1) {
          const now = new Date();
          if (new Date(button.eventEnd) < now) {
            return true;
          }
        }
        return false;
      });
  }

  setExpired(buttonId: string) {
    return this.buttonRepository.update(buttonId, { expired: true });
  }

  public deleteme(ownerId: string) {
    return this.buttonRepository
      .find({ where: { owner: { id: ownerId } } })
      .then((buttonsOwned) => {
        return buttonsOwned.map((buttonOwned) =>
          this.storageService.deleteMany(buttonOwned.images),
        );
      })
      .then(() => {
        return this.buttonRepository.delete({
          owner: { id: ownerId },
        });
      });
  }

  public monthCalendar(month: number, year: number) {
    return this.buttonRepository.find({
      where: [
        {
          eventEnd: Between(
            new Date(year, month, 1),
            new Date(year, month, 31),
          ),
        },
        {
          eventStart: Between(
            new Date(year, month, 1),
            new Date(year, month, 31),
          ),
        },
      ],
    });
  }

  moderationList(user: User, page: number) {
    return this.buttonRepository.find({
      take: 10,
      skip: page * 10,
      order: { created_at: 'DESC' },
      where: {
        awaitingApproval: true,
        ...this.expiredBlockedConditions(),
      },
    });
  }

  approve(buttonId: string) {
    return this.buttonRepository.save({
      id: buttonId,
      awaitingApproval: false,
    });
  }

  bulletin(page: number, take: number, days: number) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    return this.buttonRepository
      .find({
        where: {
          updated_at: Between(daysAgo, new Date()),
          ...this.expiredBlockedConditions(),
        },
        take: take,
        skip: take * page,
        order: {
          created_at: 'DESC',
        },
      })
      .then((buttons) => {
        return Promise.all(
          buttons.map(async (button) => {
            return this.checkAndSetExpired(button);
          }),
        ).then((btns) => {
          return btns.filter((btn) => !btn.expired);
        });
      });
  }
}
