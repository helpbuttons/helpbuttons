import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { CreateButtonDto } from '../../dto/requests/create-button.dto';
import { FilterButtonsDto } from '../../dto/requests/filter-buttons.dto';
import { UpdateButtonDto } from '../../dto/requests/update-button.dto';
import { ButtonOrm } from './buttonOrm.entity';

@Injectable()
export class ButtonOrmService {
  constructor(
    @InjectRepository(ButtonOrm)
    private readonly buttonOrmRepository: Repository<ButtonOrm>){
  }

  async create(createButtonDto: CreateButtonDto) {
    const { latitude, longitude } = createButtonDto;

    let button = {
      id: `${dbIdGenerator()}`,
      latitude: latitude,
      longitude: longitude,
      location: () => `ST_MakePoint(${longitude}, ${latitude})`,
    };

    await this.buttonOrmRepository.insert(
      [button]
    );
    return button;
  }

  async findAll(filters: FilterButtonsDto) {
    const { latitude, longitude, radius } = filters;
    
    return await this.buttonOrmRepository
        .createQueryBuilder()
        .where(`ST_Distance(
          ST_MakePoint(longitude, latitude)::geography,
          ST_MakePoint(${longitude},${latitude})::geography
        ) < :range`)
        .setParameters({
          range:radius*1000 //KM conversion
        })
       .getRawMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} button`;
  }

  update(id: string, updateButtonDto: UpdateButtonDto) {
    return `This action updates a #${id} button`;
  }

  remove(id: string) {
    return `This action removes #${id} button`;
  }
}
  