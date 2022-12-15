import { BaseEntity } from '@src/shared/types/base.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { UserCredential } from '../user-credential/user-credential.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({
    type: 'char',
    length: 36,
    generated: false,
  })
  id?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  realm?: string;

  /**
   * @summary
   * User email
   */
  @Column({
    type: 'varchar',
    unique: true,
    length: 320,
  })
  username: string;

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

  @Column({
    type: 'boolean',
    name: 'email_verified',
    nullable: true,
  })
  emailVerified?: boolean;

  @Column({
    type: 'varchar',
    name: 'verification_token',
    unique: true,
    nullable: true,
  })
  verificationToken?: string;

  @Column('varchar', {
    array: true,
  })
  roles: string[];

  @OneToOne(() => UserCredential)
  userCredential?: UserCredential;
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
