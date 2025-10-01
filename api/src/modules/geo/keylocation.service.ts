import { Injectable } from "@nestjs/common";
import { CreateKeyLocationDto } from "./keylocation.dto";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { KeyLocation } from "./keylocation.entity";
import { Repository } from "typeorm";
import { maxResolution } from "@src/shared/types/honeycomb.const";
import { uuid } from "@src/shared/helpers/uuid.helper";

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
        
        const newKeyLocation: KeyLocation = {
            ...createDto,
            id: uuid(),
            //@ts-ignore
            hexagon: () => `h3_lat_lng_to_cell(POINT(${createDto.longitude}, ${createDto.latitude}), ${maxResolution})`,
            location: () =>
                `ST_MakePoint(${createDto.latitude}, ${createDto.longitude})`,
        }
        console.log(newKeyLocation)
        return this.keyLocationRepository.insert(newKeyLocation)
      }

      list(
      ) {
        return this.keyLocationRepository.find({ order: { address: 'ASC' }})
      }

      delete(id: string)
      {
        return this.keyLocationRepository.delete(id)
      }
}