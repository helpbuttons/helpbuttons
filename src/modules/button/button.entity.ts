import { BaseEntity } from '@src/shared/types/base.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Network } from '../network/network.entity';
// https://stackoverflow.com/a/67557083

@Entity()
export class Button extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;
  
  @Column({})
  description: string;

  @Column({ type: 'double precision' })
  public latitude: number;

  @Column({ type: 'double precision' })
  public longitude: number;

  @Column({ type: 'geography' })
  location: object;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @Column('text', { array: true, nullable: true })
  images: string[];
  
  @ManyToOne(() => Network, (network) => network.buttons)
  network: Network;
  // missing, network relations, template, owner, tags
}
