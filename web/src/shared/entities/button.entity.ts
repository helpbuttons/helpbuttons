import { BaseEntity } from '@src/shared/types/base.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Network } from '../network/network.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
// https://stackoverflow.com/a/67557083

@Entity()
export class Button extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;

  @Column({})
  title: string;

  @Column({})
  description: string;

  @Column({nullable: true})
  address?: string;

  @Column({ type: 'double precision' })
  public latitude: number;

  @Column({ type: 'double precision' })
  public longitude: number;

  @Column({ type: 'geometry' })
  location: object;

  @Column({})
  type: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column('text', { array: true, nullable: true, default: [] })
  tags: string[];

  @Column('text', { array: true, nullable: true })
  images: string[];

  @ManyToOne(() => Network, (network) => network.buttons)
  network: Network;

  @OneToMany(() => Post, (feed) => feed.button)
  feed: Post[];

  @ManyToOne((type) => User)
  owner: User;

  @Column('text')
  hexagon: string;

  @Column('boolean', {default: false})
  deleted: boolean;

  @Column('boolean', {default: false})
  hideAddress: boolean;

  /** Custom Fields **/
  /** price: **/
  @Column({default: 0, type: 'double precision' })
  price: number;

  /** event: **/
  @Column('text') // recurrent, multidate, once, always
  eventType: string;
  
  /*
  recurrent:
   when = {
    type: 'recurrent'
    data: {
      frequency: '1m', // '1w'
    }
   }
  
   multidate = {
    type: 'multidate' // start and endDate define the dates..
   }

   once = {
    type: 'once' // only start date
   }
  */
  @Column({
    type: 'timestamp',
  })
  eventStart: Date;

  @Column({
    type: 'timestamp',
  })
  eventEnd: Date;
}
