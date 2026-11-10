import { BaseEntity } from '@src/shared/types/base.entity';
import { Role } from '@src/shared/types/roles';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { UserCredential } from '../user-credential/user-credential.entity';

@Entity()
@Exclude()
export class User extends BaseEntity {
  @Expose()
  @PrimaryColumn({
    type: 'char',
    length: 36,
    generated: false,
  })
  id?: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  realm?: string;

  /**
   * @summary
   * User email
   */
  @Expose()
  @Column({
    type: 'varchar',
    unique: true,
    length: 320,
  })
  username: string;

  @Exclude()
  @Column({
    type: 'varchar',
    unique: true,
    length: 320,
  })
  email: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
  })
  name: string;

  @Exclude()
  @Column({
    type: 'boolean',
    name: 'email_verified',
    nullable: true,
  })
  emailVerified?: boolean;

  @Exclude()
  @Column({
    type: 'varchar',
    name: 'verification_token',
    unique: true,
    nullable: true,
  })
  verificationToken?: string;

  @Expose()
  @Column({
    type: 'text',
    default: Role.registered
  })
  role: string;

  @Expose()
  @Column({
    type: 'text'
  })
  description: string;
  
  @Expose()
  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @OneToOne(() => UserCredential)
  userCredential?: UserCredential;

  @Expose()
  @Column({type: 'text', default: 'en'})
  locale: string;

  @Expose()
  @Column({default: true})
  receiveNotifications: boolean;

  @Expose()
  @Column({default: false})
  showButtons: boolean;

  @Column('text', { array: true, nullable: true, default: [] })
  tags: string[];

  @Column()
  address?: string;

  @Column({ type: 'geography', nullable: true })
  center?: object;

  @Column({default: 0})
  radius: number;

  @Column('text', {nullable: true})
  phone?: string;

  @Expose()
  @Column({default: false})
  publishPhone?: boolean;

  @Column('text', {nullable: true})
  qrcode?: string;

  @Expose()
  @Column({default: false})
  showWassap: boolean;

  @Expose()
  @Column({default: false})
  endorsed?: boolean;

  @Expose()
  @Column('text', { array: true, default: [] })
  follows: string[];

  @Expose()
  @Column({default: false})
  hasPhone?: boolean;

  @Expose()
  @Column({type: 'jsonb', default: {}})
  readGroupMessages?: string;

  @Column('text', {nullable: true})
  endpoint?: string;

  @Column('text', {nullable: true})
  p256dh?: string

  @Column('text', {nullable: true})
  auth?: string
  
  @Column('text', {nullable: true})
  expirationTime?: number | null

}

export class UserProfile {

@Expose()
id?: string;

@Expose()
username: string;

@Expose()
email: string;

@Expose()
name: string;

@Expose()
emailVerified?: boolean;

@Expose()
role: string;

@Expose()
description: string;

@Expose()
avatar?: string;

@Expose()
locale: string;

@Expose()
receiveNotifications: boolean;

@Expose()
showButtons: boolean;

@Expose()
tags: string[];

@Expose()
address?: string;

@Expose()
center?: object;

@Expose()
radius: number;

@Expose()
phone?: string;

@Expose()
publishPhone?: boolean;

@Expose()
qrcode?: string;

@Expose()
showWassap: boolean;

@Expose()
endorsed?: boolean;

// @Expose()
// follows: string[];

@Expose()
hasPhone?: boolean;

// @Expose()
// readGroupMessages?: string;
followsCount: number;
commentCount: number;
buttonCount: number;

pushSubscribed: boolean;

}
export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;


export class UserExtended extends User {
  @Expose()
  followsCount: number;

  @Expose()
  commentCount: number;

  @Expose()
  buttonCount: number;
} 