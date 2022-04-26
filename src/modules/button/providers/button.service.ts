import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BaseService } from '@src/shared/libs/tapsa-crud';
import { CreateButtonDto } from '../dto/requests/create-button.dto';
import { FilterButtonsDto } from '../dto/requests/filter-buttons.dto';
import { UpdateButtonDto } from '../dto/requests/update-button.dto';
import { ButtonWithRelations } from '../types/button.type';
import { ButtonRepository } from './button.repository';

@Injectable()
export class ButtonService extends BaseService<
  ButtonWithRelations,
  Prisma.ButtonCreateArgs,
  Prisma.ButtonUpdateArgs,
  Prisma.ButtonUpdateManyArgs,
  Prisma.ButtonFindFirstArgs,
  Prisma.ButtonFindManyArgs,
  Prisma.ButtonDeleteArgs,
  Prisma.ButtonDeleteManyArgs
> {
  constructor(private readonly buttonRepository: ButtonRepository) {
    super(buttonRepository, {
      DUPLICATE: 'Duplicate button inserted',
      NOT_FOUND: 'Button could not found',
    });
  }

  async create(createButtonDto: CreateButtonDto) {
    const { latitude, longitude } = createButtonDto;

    return await this.buttonRepository.create({
      data: {
        // README: just ignore this id: ''.
        id: '',
        latitude,
        longitude,
      },
    });
  }

  async findAll(filters: FilterButtonsDto) {
    const { buttonsWithin, latitude, longitude } = filters;

    return await this.buttonRepository.findAll({
      squareCenter: {
        latitude,
        longitude,
      },
      squareWithin: buttonsWithin,
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} button`;
  }

  update(id: string, updateButtonDto: UpdateButtonDto) {
    return `This action updates a #${id} button`;
  }
}
