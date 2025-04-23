import { ApiProperty } from '@nestjs/swagger';
import { Button } from './button.entity';
import {
  MinLength,
  IsLatitude,
  IsLongitude,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// https://github.com/typestack/class-validator

export class CreateButtonDto implements Partial<Button> {
  @ApiProperty({
    type: String,
    required: true,
  })
  @MinLength(3, {
    message: 'button name is too short',
  })
  title: string;
  
  @ApiProperty({
    type: String,
    required: true,
  })
  type: string;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({})
  tags: string[];

  description: string;

  @ApiProperty({
    name: 'latitude',
    title: 'Latitude',
    description: 'Latitude of the button',
    type: Number,
    isArray: false,
    required: true,
    example: 39.23864,
  })
  @IsLatitude({message: 'invalid-latitude'})
  latitude: number;

  @ApiProperty({
    name: 'longitude',
    title: 'Longitude',
    description: 'Longitude of the button',
    type: Number,
    isArray: false,
    required: true,
    example: -8.67096,
  })
  @IsLongitude({message: 'invalid-longitude'})
  longitude: number;

  image: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  address: string;

  hideAddress: boolean;

  price?: number;

  eventStart?: Date;

  eventEnd?: Date;
  
  eventType?: string;

  images?: string[];

  eventData: string;

  isCustomAddress?: boolean;
}

export class UpdateButtonDto extends PartialType(CreateButtonDto) {}

export class ButtonTemplate {
  name: string;
  color: string;
  caption: string;
  cssColor: string;
  customFields: ButtonTemplateCustomFields[];
  hide: boolean;
  icon: string;
}

class ButtonTemplateCustomFields {
  type: string;
}