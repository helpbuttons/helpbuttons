import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository, In, EntityManager, Not } from 'typeorm';
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
import translate, { readableDate } from '@src/shared/helpers/i18n.helper';
// import { RRule } from 'rrule';

@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    private readonly tagService: TagService,
    private readonly networkService: NetworkService,
    private readonly storageService: StorageService,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    createDto: CreateButtonDto,
    networkId: string,
    images: File[],
    user: User,
  ) {
    const network = await this.networkService.findOne(networkId);

    let hasPhone = false
    if(user.phone)
    {
      hasPhone = true
    }

    if (!network) {
      throw new HttpException(
        { message: 'Network not found' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const buttonTemplates = network.buttonTemplates;
    const buttonTemplate = buttonTemplates.find(
      (buttonTemplate) => buttonTemplate.name == createDto.type,
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
    const button = {
      id: dbIdGenerator(),
      type: createDto.type,
      description: createDto.description,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: this.tagService.formatTags(createDto.tags),
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
      eventData: createDto.eventData
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

        if (createDto.images?.length > 0) {
          await Promise.all(
            createDto.images.map(async (image) => {
              if (isImageData(image)) {
                try {
                  const newImage =
                    await this.storageService.newImage64(image);
                  if (newImage) {
                    button.images.push(newImage);
                  }
                } catch (err) {
                  throw new ValidationException({
                    images: err.message,
                  });
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
        await this.buttonRepository.insert([button]);
      },
    );

    return await button;
  }

  async findById(id: string, includeDeleted: boolean = false) {
    let button: Button = await this.buttonRepository.findOne({
      where: { id, ...this.deletedBlockedConditions(includeDeleted) },
      relations: ['owner'],
    });

    if (!button) {
      throw new HttpException(
        'button not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return { ...button };
  }

  async update(id: string, updateDto: UpdateButtonDto, currentUser: User) {
    const currentButton = await this.findById(id)

    let location = {};
    let hexagon = {}
    if (updateDto.latitude > 0 && updateDto.longitude > 0) {
      location = {
        location: () =>
          `ST_MakePoint(${updateDto.latitude}, ${updateDto.longitude})`,
      };
      hexagon = {hexagon: () =>
      `h3_lat_lng_to_cell(POINT(${updateDto.longitude}, ${updateDto.latitude}), ${maxResolution})`}
    } else {
      delete updateDto.latitude;
      delete updateDto.longitude;
    }

    let hasPhone = false
    if(currentButton.owner.phone)
    {
      hasPhone = true
    }
    const button = {
      ...updateDto,
      ...location,
      ...hexagon,
      hasPhone,
      images: [],
      id,
      tags: this.tagService.formatTags(updateDto.tags),
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
              throw new ValidationException({ images: err.message });
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

    return this.buttonRepository.save([button]);
  }

  async findh3(resolution, hexagons) {
    try {
      // const btnTemplateEvents =
      // await this.networkService.getButtonTemplatesEvents();

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
          `h3_cell_to_parent(cast (button.hexagon as h3index),${resolution}) IN(:...hexagons) AND deleted = false`,
          { hexagons: hexagons },
        )
        .limit(1000)
        .execute();
      const buttonsIds = buttonsOnHexagons.map((button) => button.id);

      return this.buttonRepository.find({
        relations: ['feed', 'owner'],
        where: {
          id: In(buttonsIds),
          ...this.deletedBlockedConditions(),
        },
        order: {
          created_at: 'DESC',
        },
      // }).then((buttons) => {
      //   return buttons.map((button) => {
      //     if(btnTemplateEvents.indexOf(button.type) > -1)
      //     {
      //       return this.calculateRecurrent(button)
      //     }
      //     return button;
      //   })
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

  public isOwner(currentUser: User, buttonId: string, includeDeleted :boolean = false) {
    return this.findById(buttonId, includeDeleted).then((button) => {
      if (
        currentUser.role == Role.admin ||
        currentUser.id == button.owner.id
      ) {
        return true;
      }
      return false;
    });
  }

  async findAdminButton() {
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
    return { ...button };
  }

  async findByOwner(ownerId: string) {
    let buttons: Button[] = await this.buttonRepository.find({
      where: { owner: {id: ownerId, role: Not(Role.blocked)}, deleted: false},
      relations: [
        'owner',
      ],
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

  async getPhone(buttonId: string)
  {
    const query = `SELECT public.user.phone from button, public.user WHERE button.id = '${buttonId}' AND "ownerId" = public.user.id`;
    const result = await this.entityManager.query(query)
    
    if(result.length > 0)
    {
      return result[0].phone;
    }
    return '';
  }

  findDeletedAndRemoveMedia()
  { // created more than 1 month ago
    return this.entityManager.query(
      `select id, images from button where deleted = true AND updated_at < now() - INTERVAL '1 month'`,
    ).then((buttonsDeleted) => {
      return buttonsDeleted.map((button) => {
        return this.removeMedia(button.id, button.images)
      })
    })
  }
  private removeMedia(buttonId: string, images: string[])
  {
      return images.map((imagePath) => {
        const path = imagePath.replace('/files/get/', './uploads/')
        console.log('removing media: ' + path)
        return fs.unlinkSync(path)
      })
  }

  deletedBlockedConditions(includeDeleted: boolean = false) {
    const blocked = { owner: { role: Not(Role.blocked) } };
    if(includeDeleted)
    {
      return blocked;  
    }
    return { deleted: false, ...blocked};
  }

  @OnEvent(ActivityEventName.NewPostComment)
  async autoFollowButton(payload: any) {
    switch (payload.activityEventName) {
      case ActivityEventName.NewPostComment:
        const buttonId = payload.data.button.id
        const userId = payload.data.author.id
        this.follow(buttonId, userId)
        break;
    }
  }

  @OnEvent(ActivityEventName.NewPost)
  @OnEvent(ActivityEventName.NewPostComment)
  async updateDate(payload: any)
  {
    const buttonId = payload.data.button.id
    await this.updateModifiedDate(buttonId)
  }
  
  renew(buttonId: string, user: User)
  {
    return this.updateModifiedDate(buttonId).then(() => {
        return this.postService.new(translate(user.locale, 'post.renewPost', [readableDate(user.locale)]), buttonId, user)
    })
  }

  updateModifiedDate(buttonId: string)
  {
    return this.entityManager.query(`UPDATE button SET updated_at = CURRENT_TIMESTAMP, deleted = false WHERE id = '${buttonId}'`)
  }
}
