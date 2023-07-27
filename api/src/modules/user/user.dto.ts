import { Column } from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdentification extends User {}

export class UserUpdateDto {
  @Column({
    type: 'varchar',
    unique: true,
    length: 320,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  password_current?: string;

  @Column({ type: 'text', nullable: true })
  password_new?: string;

  @Column({ type: 'text', nullable: true })
  password_new_confirm?: string;

  @Column({ default: false })
  set_new_password?: boolean;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  locale: string;
}
