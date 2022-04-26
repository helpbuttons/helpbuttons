import { ApiProperty } from '@nestjs/swagger';
import { Button } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class CreateButtonDto implements Partial<Button> {
  @ApiProperty({
    name: 'latitude',
    title: 'Latitude',
    description: 'Latitude of the button',
    type: Number,
    isArray: false,
    required: true,
    example: 22.325_722_878_836_917,
  })
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 20,
  })
  latitude: number;

  @ApiProperty({
    name: 'longitude',
    title: 'Longitude',
    description: 'Longitude of the button',
    type: Number,
    isArray: false,
    required: true,
    example: 114.1681843685841,
  })
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 20,
  })
  longitude: number;
}
