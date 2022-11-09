import { BaseEntity } from '@src/shared/types/base.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Button } from '../button/button.entity';
import { User } from '../user/user.entity';

@Entity()
export class FeedButton extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;

  @ManyToOne(type => Button)
  button: Button;

  @Column({})
  message: string;

  @ManyToOne(type => User)
  author: User;

}
