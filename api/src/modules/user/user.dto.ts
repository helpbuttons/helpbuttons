import { Column } from 'typeorm';
import { User } from './user.entity';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UserIdentification extends User {}

export class UserUpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  avatar?: string;

  password_new?: string;

  password_new_confirm?: string;

  @IsBoolean()
  set_new_password?: boolean;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  locale: string;

  @Column({ default: true })
  receiveNotifications: boolean;

  inviteCode?: string;

  showButtons?: boolean;

  @IsOptional()
  @IsArray({})
  tags: string[];

  center?: number[];

  address?: string;

  radius?: number;
}
