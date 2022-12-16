import { BaseEntity } from '@src/shared/types/base.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Button } from '../button/button.entity';

export enum PrivacyType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
@Entity()
export class Network extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({})
  description: string;

  @Column({ nullable: true })
  url?: string;

  @Column({
    type: 'enum',
    enum: PrivacyType,
    default: PrivacyType.PUBLIC,
    nullable: true,
  })
  privacy: PrivacyType;

  @Column({ type: 'double precision' })
  radius: number;

  @Column({ type: 'double precision' })
  public latitude: number;

  @Column({ type: 'double precision' })
  public longitude: number;

  @Column({ type: 'geometry' })
  location: string;

  @Column('text', { array: true, nullable: true, default: [] })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  logo?: string;

  @Column({ type: 'text', nullable: true })
  jumbo?: string;

  @OneToMany(() => Button, (button) => button.network)
  buttons: Network[];
  // missing, templates, buttons, friendNetworks, owner
}
