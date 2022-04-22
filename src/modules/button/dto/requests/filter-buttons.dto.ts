import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterButtonsDto {
  @ApiProperty({
    name: 'buttonsWithin',
    title: 'Other Buttons Within',
    description:
      'Get other buttons within the specified area in kilometer',
    type: Number,
    example: 4,
    required: false,
    isArray: false,
  })
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 10,
  })
  buttonsWithin?: number;

  @ApiProperty({
    name: 'latitude',
    title: 'Latitude',
    description:
      'Latitude of the center. This is only required in case you pass the buttonsWithin',
    type: Number,
    isArray: false,
    required: false,
    example: 22.325722878836917,
  })
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 20,
  })
  latitude?: number;

  @ApiProperty({
    name: 'longitude',
    title: 'Longitude',
    description:
      'Longitude of the center. This is only required in case you pass the buttonsWithin',
    type: Number,
    isArray: false,
    required: false,
    example: 114.1681843685841,
  })
  @IsOptional()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 20,
  })
  longitude?: number;
}
