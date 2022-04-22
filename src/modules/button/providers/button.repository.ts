import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BasePrismaRepository } from '@src/shared/libs/tapsa-repository';
import { PrismaService } from '@src/shared/modules/prisma-management/prisma-management.service';
import { FindAll } from '../types/button-repository.type';
import { ButtonWithRelations } from '../types/button.type';

@Injectable()
export class ButtonRepository extends BasePrismaRepository<
  ButtonWithRelations,
  Prisma.ButtonCreateArgs,
  Prisma.ButtonUpdateArgs,
  Prisma.ButtonUpdateManyArgs,
  Prisma.ButtonFindFirstArgs,
  Prisma.ButtonFindManyArgs,
  Prisma.ButtonDeleteArgs,
  Prisma.ButtonDeleteManyArgs
> {
  constructor(public readonly prismaService: PrismaService) {
    super(prismaService.button);
  }

  async findAll(filters: FindAll) {
    const { squareCenter, squareWithin } = filters;
    const { longitude, latitude } = squareCenter;

    return await this.prismaService.$queryRaw`
      SELECT
        *
      FROM
        buttons
      WHERE
        ST_DWithin(ST_MakePoint(longitude, latitude)::geography, ST_MakePoint(${longitude}, ${latitude})::geography, ${squareWithin})
      `;
  }
}
