import { Injectable } from "@nestjs/common";
import { CreateKeyLocationDto } from "./keylocation.dto";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { KeyLocation } from "./keylocation.entity";
import { Repository } from "typeorm";
import { maxResolution } from "@src/shared/types/honeycomb.const";
import { newsguuid } from "@src/shared/helpers/uuid.helper";

@Injectable()
export class KeyLocationService {
    constructor(
        @InjectRepository(KeyLocation)
        private readonly keyLocationRepository: Repository<KeyLocation>){
            
        }
    new(
        createDto: CreateKeyLocationDto,
        user: User
      ) {
        
        newsguuid(createDto.address, this.findById)
        .then((uuid) => {
          return {
            ...createDto,
            id: uuid,
            //@ts-ignore
            hexagon: () => `h3_lat_lng_to_cell(POINT(${createDto.longitude}, ${createDto.latitude}), ${maxResolution})`,
            location: () =>
                `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
            zoom: createDto.zoom
        }
        })
        .then((newKeyLocation) => this.keyLocationRepository.insert(newKeyLocation))
        
      }

      async findById(
        id: string,
      ): Promise<any> {
        return this.keyLocationRepository.findOne({where: {id: id}})
      }

      list(
      ) {
        return this.keyLocationRepository.find()
      }

      delete(id: string)
      {
        return this.keyLocationRepository.delete(id)
      }
}