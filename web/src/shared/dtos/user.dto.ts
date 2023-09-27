import { Column } from 'typeorm';
import { User } from './user.entity';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserIdentification extends User {}

export class UserUpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  avatar?: string;

  password_current?: string;

  password_new?: string;

  password_new_confirm?: string;

  @IsBoolean()
  set_new_password?: boolean;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  locale: string;

  @Column({default: true})
  receiveNotifications: boolean;

  inviteCode?: string;  
}
