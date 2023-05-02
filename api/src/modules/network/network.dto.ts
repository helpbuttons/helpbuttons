import { ApiProperty } from '@nestjs/swagger';
import { Network, PrivacyType } from './network.entity';
import {
  IsNumber,
  MinLength,
  IsLatitude,
  IsLongitude,
  IsArray,
  IsOptional,
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { User } from '../user/user.entity';

// https://github.com/typestack/class-validator

export class CreateNetworkDto implements Partial<Network> {
  
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @MinLength(3, {
    message: 'name is too short',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @MinLength(3, {
    message: 'description is too short',
  })
  description: string;

  @ApiProperty({
    enum: ['public', 'private'],
    required: false,
    name: 'privacy',
    description: 'Public or private',
  })
  @IsEnum(['public', 'private'])
  privacy: PrivacyType;

  @ApiProperty({
    name: 'radius',
    description: 'radius in km',
    type: Number,
    example: 10,
  })
  radius: number;

  @ApiProperty({
    name: 'latitude',
    title: 'Latitude',
    description: 'Latitude of the button',
    type: Number,
    isArray: false,
    required: true,
    example: 39.23864,
  })
  @IsLatitude()
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
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({})
  tags: string[];

  @IsNotEmpty()
  logo: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  jumbo: string;

  @IsNumber()
  zoom: number;
  
  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsArray({})
  hexagons: string[];

  @IsNumber()
  resolution: number;

  @IsString()
  tiletype: string;
}

export class UpdateNetworkDto extends PartialType(CreateNetworkDto) {}

export class NetworkDto extends Network {

  @Column({})
  administrator: User;
}
