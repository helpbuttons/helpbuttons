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

  @Column('text', { array: true, nullable: true, default: [] })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  logo?: string;

  @Column({ type: 'text', nullable: true })
  jumbo?: string;

  @Column({nullable: true})
  address: string;

  @OneToMany(() => Button, (button) => button.network)
  buttons: Button[];

  @Column()
  exploreSettings: string;

  @Column({default: '#0E0E0E'})
  textColor: string;

  @Column({default: '#FFDD02'})
  backgroundColor: string;

  @Column({default: 'helpButton'})
  nomeclature: string;

  @Column()
  buttonTemplates: string;

  @Column({default: 'en'})
  locale: string;

  @Column({default: false})
  inviteOnly: boolean;

  @Column({default: 'EUR'})
  currency: string;
}
