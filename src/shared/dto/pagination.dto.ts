import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { isNil } from '../helpers';

export class PaginationOptionsDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform((input) => {
    return !isNil(input.value) ? parseInt(input.value) : null;
  })
  take: number = 10;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform((input) => {
    return !isNil(input.value) ? parseInt(input.value) : null;
  })
  page: number = 1;
}

export class OptionalPaginationOptionsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform((input) => {
    return !isNil(input.value) ? parseInt(input.value) : null;
  })
  take?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform((input) => {
    return !isNil(input.value) ? parseInt(input.value) : null;
  })
  page?: number;
}
