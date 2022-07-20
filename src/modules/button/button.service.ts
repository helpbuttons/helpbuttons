import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CreateButtonDto,UpdateButtonDto } from './button.dto';
import { Button } from './button.entity';
import { getManager } from "typeorm";
import { NetworkService } from '../network/network.service';
import { StorageService } from '../storage/storage.service';
import { User } from '../user/user.entity';

@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    private readonly tagService: TagService,
    private readonly networkService: NetworkService,
    private readonly storageService: StorageService) {
  }

  async create(createDto: CreateButtonDto, networkId: string, images: File[], user: User) {
    const network = await this.networkService.findOne(networkId);
    
    if (!network) {
      throw new HttpException({message: 'Network not found'}, HttpStatus.BAD_REQUEST)
    }
    
    let button = {
      id: dbIdGenerator(),
      description: createDto.description,
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      tags: createDto.tags,
      location: () => `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
      network: network,
      images: [],
      owner: user,
    }
    
    await getManager().transaction(async transactionalEntityManager => {
      if (Array.isArray(button.tags)) {
        await this.tagService.addTags('button', button.id, button.tags).catch(err => {
          console.log(`Error adding tags ${JSON.stringify(button.tags)} to button ${button.id}`)
          throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST)
        });
      }
      
      if (Array.isArray(images) && images.length > 0) {
        button.images = await Promise.all(images.map( async (imageFile) => {
          return await (await this.storageService.newImage(imageFile));
        }));
      }
      
      await this.buttonRepository.insert([button]);
    });
    
    return button;
  }

  findOne(id: string) {
    return this.buttonRepository.findOne({
      where: {id},
      relations: ['network', 'feed'],
    });
  }

  update(id: string, updateDto: UpdateButtonDto) {

    let location = {};

    if (updateDto.latitude > 0 && updateDto.longitude > 0)
    {
      location = {location: () => `ST_MakePoint(${updateDto.latitude}, ${updateDto.longitude})`};
    }else {
      delete updateDto.latitude
      delete updateDto.longitude
    }

    let button = {
      ...updateDto,
      ...location,
      id
    }
    
    if (button.tags) {
      this.tagService.updateTags('button', button.id, button.tags)
    }

    return this.buttonRepository.save([button]);
  }

  findAll(networkId: string, bounds: any) {
    // ST_Contains
    // ST_Point
    // SELECT ST_MakePolygon( ST_GeomFromText('LINESTRING(75 29,77 29,77 29, 75 29)'));

    // ST_Shift_Longitude(location)
    // northEast: {
    //   lat: northEast_lat,
    //   lng: northEast_lng,
    // },
    // southWest: {
    //   lat: southWest_lat,
    //   lng: southEast_lng
    // }

    const query = `SELECT button.location, button.description
FROM button 
WHERE ST_Contains(ST_GEOMFROMTEXT('POLYGON((
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

))'), button.location);`;
console.log(query);
    // select ST_Shift_Longitude(ST_GeographyFromText('SRID=4326;POINT(0 0)')) && 
    // ST_Shift_Longitude(ST_GeographyFromText('SRID=4326;POLYGON((180 -80,  -80 -80, -80 80, 180 80, 180 -80))')) as expectTrue_1, 
    const polygon = "";

    return this.buttonRepository.find({
      relations: ['network', 'feed'],
      where: {
        network: {
          id: networkId
        }
      },
      order: {
        created_at: "DESC"
    }});
  }

  remove(id: string) {
    return this.buttonRepository.delete({id});
  }
}
  /*

SELECT button.location, button.description
FROM button 
WHERE ST_Contains(ST_GEOMFROMTEXT('POLYGON((
  38.40993643412625
  -2.7052797510194653,

  38.803246523797704
  -2.7052797510194653,

  38.803246523797704
  -3.4090913965272778,

  38.40993643412625
  -3.4090913965272778,
  
  38.40993643412625
  -2.7052797510194653

))'), ST_GEOMFROMTEXT('POINT(38.75 -3.33)'));
button.latitude


SELECT
ST_GEOMFROMTEXT('POLYGON((
  38.40993643412625
  -2.7052797510194653,

  38.803246523797704
  -2.7052797510194653,

  38.803246523797704
  -3.4090913965272778,

  38.40993643412625
  -3.4090913965272778,

  38.40993643412625
  -2.7052797510194653

))')*/