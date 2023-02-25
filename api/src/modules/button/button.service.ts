import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { isImageData } from '@src/shared/helpers/imageIsFile';

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
      address: createDto.address
    };
    console.log(button)
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

        await this.buttonRepository.insert([button]);
      },
    );

    return button;
  }

  async findById(id: string) {
    let button: Button = await this.buttonRepository.findOne({
      where: { id },
      relations: ['network', 'feed', 'owner'],
    });
    try {
      // let createdButtonsCount = await this.buttonRepository.count({where: {owner:  button.owner.id}});
      return {...button}
      // , createdButtonsCount}
    }catch(err){
    }
    return {...button};
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

    if (isImageData(updateDto.image))
    {
      try {
        const newImage = await this.storageService.newImage64(
          updateDto.image,
        );
        if (newImage){
          button.image = newImage;
        }
      } catch (err) {
        throw new ValidationException({ logo: err.message });
      }
    }
    

    return this.buttonRepository.save([button]);
  }

  async findAll(networkId: string, bounds: any) {
    try {
      const buttonsOnBounds = await this.buttonRepository
        .createQueryBuilder('button')
        .select('id')
        .where(
          `
      button.networkId = '${networkId}' AND
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
        )
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
      console.log(err)
      return [];
    }
  }

  async delete(id: string) {
    const res = await this.buttonRepository.delete({ id })
    return res.affected;
  }

  public isOwner(currentUser, buttonId)
  {
    if(!currentUser || !currentUser.role)
    {
      throw new CustomHttpException(ErrorName.NeedToBeRegistered)
    }

    if(currentUser.role == Role.admin || currentUser.id == buttonId)
    {
      return true;
    }
    throw new CustomHttpException(ErrorName.NoButtonOwnerShip)
  }
}
