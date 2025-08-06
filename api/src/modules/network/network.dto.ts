import { ApiProperty } from '@nestjs/swagger';
import { Network } from './network.entity';
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
import { PrivacyType } from "@src/shared/types/privacy.enum";
import { ButtonTemplate } from '../button/button.dto';

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
    type: String,
    required: true,
  })
  @IsString()
  @MinLength(3, {
    message: 'slogan is too short',
  })
  slogan: string;

  @ApiProperty({
    enum: ['public', 'private'],
    required: false,
    name: 'privacy',
    description: 'Public or private',
  })
  @IsEnum(['public', 'private'])
  privacy: PrivacyType;

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
  jumbo: string;

  @IsNotEmpty()
  exploreSettings: string;

  @IsNotEmpty()
  backgroundColor: string;

  @IsNotEmpty()
  textColor: string;

  @IsNotEmpty()
  buttonTemplates: ButtonTemplate[];

  @IsNotEmpty()
  requireApproval: boolean;

  inviteOnly: boolean;

  currency?: string;

  locale: string;

  nomeclature?: string;

  nomeclaturePlural?: string;

  hideLocationDefault: boolean;

  allowGuestCreation: boolean;
}

export class UpdateNetworkDto extends PartialType(CreateNetworkDto) {}

export class NetworkDto extends Network {
  @Column({})
  administrators: User[];
}
