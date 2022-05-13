import { BaseEntity } from '@src/shared/types/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryColumn({
    type: 'char',
    length: 36,
    generated: false,
  })
  id: string;

  @Column({
    type: 'varchar',
  })
  realm?: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  username?: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 320,
  })
  email: string;

  @Column({
    type: 'boolean',
    name: 'email_verified',
  })
  emailVerified?: boolean;

  @Column({
    type: 'varchar',
    name: 'verification_token',
    unique: true,
  })
  verificationToken?: string;

  @Column({
    type: 'jsonb',
    array: true,
  })
  roles: string[];

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'jsonb',
    array: true,
  })
  interests: string[];
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
