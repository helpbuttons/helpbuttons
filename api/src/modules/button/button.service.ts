import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository, In } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateButtonDto, UpdateButtonDto } from './button.dto';
import { Button } from './button.entity';
import { getManager } from 'typeorm';
import { NetworkService } from '../network/network.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/user.entity';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';
import { Role } from '@src/shared/types/roles';
import { isImageData } from '@src/shared/helpers/imageIsFile';
import { maxResolution } from '@src/shared/types/honeycomb.const';
@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    private readonly tagService: TagService,
    private readonly networkService: NetworkService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createDto: CreateButtonDto,
    networkId: string,
    images: File[],
    user: User,
  ) {
    const network = await this.networkService.findOne(networkId);

    if (!network) {
      throw new HttpException(
        { message: 'Network not found' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const button = {
      id: dbIdGenerator(),
      type: createDto.type,
      description: createDto.description,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: createDto.tags,
      location: () =>
        `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
      network: network,
      images: [],
      owner: user,
      image: null,
      title: createDto.title,
      address: createDto.address,
      when: createDto.when,
      hexagon: () => `h3_lat_lng_to_cell(POINT(${createDto.longitude}, ${createDto.latitude}), ${maxResolution})`
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

        try {
          button.image = await this.storageService.newImage64(
            createDto.image,
          );
        } catch (err) {
          console.log(`errorjumboooooror: ${err.message}`);
          throw new ValidationException({ image: err.message });
        }
        await this.buttonRepository.insert([button])
      },
    );

    return await button;
  }

  async findById(id: string) {
    let button: Button = await this.buttonRepository.findOne({
      where: { id },
      relations: [
        'owner',
      ],
    });
    try {
      return { ...button };
    } catch (err) {}
    return { ...button };
  }

  async update(id: string, updateDto: UpdateButtonDto) {
    let location = {};
    if (updateDto.latitude > 0 && updateDto.longitude > 0) {
      location = {
        location: () =>
          `ST_MakePoint(${updateDto.latitude}, ${updateDto.longitude})`,
      };
    } else {
      delete updateDto.latitude;
      delete updateDto.longitude;
    }

    const button = {
      ...updateDto,
      ...location,
      id,
    };

    if (button.tags) {
      await this.tagService.updateTags('button', id, button.tags);
    }

    if (isImageData(updateDto.image)) {
      try {
        const newImage = await this.storageService.newImage64(
          updateDto.image,
        );
        if (newImage) {
          button.image = newImage;
        }
      } catch (err) {
        throw new ValidationException({ logo: err.message });
      }
    }

    return this.buttonRepository.save([button]);
  }

  async findAll(bounds: any) {
    try {
      const buttonsOnBounds = await this.buttonRepository
        .createQueryBuilder('button')
        .select('id')
        .where(
          `
      ST_Contains(ST_GEOMFROMTEXT('POLYGON((
      ${bounds.southWest.lat}
      ${bounds.northEast.lng},
    
      ${bounds.northEast.lat}
      ${bounds.northEast.lng},
    
      ${bounds.northEast.lat}
      ${bounds.southWest.lng},
    
      ${bounds.southWest.lat}
      ${bounds.southWest.lng},
    
      ${bounds.southWest.lat}
      ${bounds.northEast.lng}
    
    ))'), button.location)`,
        ).limit(1000)
        .execute();

      const buttonsIds = buttonsOnBounds.map((button) => button.id);

      return this.buttonRepository.find({
        relations: ['network', 'feed', 'owner'],
        where: {
          id: In(buttonsIds),
        },
        order: {
          created_at: 'DESC',
        },
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  // NOT USED.. for the record stays here
  async findh3(resolution, hexagons) {
    try {
      if(hexagons && hexagons.length > 500)
      {
        throw new HttpException('too many hexagons requested, aborting',HttpStatus.PAYLOAD_TOO_LARGE)
      }
      const buttonsOnHexagons = await this.buttonRepository
        .createQueryBuilder('button')
        .select('id')
        .where(`h3_cell_to_parent(cast (button.hexagon as h3index),${resolution}) IN(:...hexagons)`,{ hexagons:hexagons })
        .limit(10000)
        .execute();
        const buttonsIds = buttonsOnHexagons.map((button) => button.id);

        return this.buttonRepository.find({
          relations: ['feed', 'owner'],
          where: {
            id: In(buttonsIds),
          },
          order: {
            created_at: 'DESC',
          },
        });
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async delete(id: string) {
    const res = await this.buttonRepository.delete({ id });
    return res.affected;
  }

  public isOwner(currentUser: User, buttonId: string) {
    return this.findById(buttonId).then((button) => {
      if (
        currentUser.role == Role.admin ||
        currentUser.id == button.owner.id
      ) {
        return true;
      }
      return false;
    });
  }
}
