import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from '@src/shared/types/base.entity';

@Entity({ name: 'user-credentials' })
export class UserCredential extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
  })
  userId: string;
}
