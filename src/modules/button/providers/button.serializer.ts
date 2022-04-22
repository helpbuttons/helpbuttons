import { Injectable } from '@nestjs/common';

import { Pagination } from '@src/shared/libs/tapsa-repository/tapsa-repository.type';
import { BaseSerializer } from '@src/shared/libs/tapsa-serializer';
import { ButtonResponseDto } from '../dto/responses/button.dto';
import { ButtonWithRelations } from '../types/button.type';

@Injectable()
export class ButtonSerializer extends BaseSerializer<
  ButtonWithRelations,
  ButtonResponseDto
> {
  public async serialize(
    contactUsRequest: ButtonWithRelations,
    outputType: 'ButtonResponseDto',
  ): Promise<ButtonResponseDto> {
    if (outputType === 'ButtonResponseDto') {
      return new ButtonResponseDto(contactUsRequest);
    }
  }

  public async serializePaginated(
    value: Pagination<ButtonWithRelations>,
    outputType: 'ButtonResponseDto',
  ): Promise<Pagination<ButtonResponseDto>> {
    let paginated: Pagination<ButtonResponseDto>;

    if (outputType === 'ButtonResponseDto') {
      paginated = new Pagination<ButtonResponseDto>(
        value.items.map(
          (contactUsRequest) =>
            new ButtonResponseDto(contactUsRequest),
        ),
        value.meta,
        value.links,
      );
    }

    return paginated;
  }
}
