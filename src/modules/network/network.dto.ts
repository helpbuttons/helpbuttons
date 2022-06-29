import { ApiProperty } from '@nestjs/swagger';
import { Network } from './network.entity';
import { IsNumber, MinLength, IsLatitude, IsLongitude, IsArray, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// https://github.com/typestack/class-validator

export class CreateNetworkDto implements Partial<Network> {
  @ApiProperty({
    type: String,
    required: true,
  })
  @MinLength(3, {
    message: 'name is too short',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @MinLength(3, {
    message: 'description is too short',
  })
  description: string;
  
  @ApiProperty({
    type: String,
  })
  @MinLength(3, {
    message: 'url is too short',
  })
  url: string;

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
}


export class UpdateNetworkDto extends PartialType(CreateNetworkDto) {}