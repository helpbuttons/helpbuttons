import {  Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { BaseEntity } from '@src/shared/types/base.entity';
import { User } from "../user/user.entity";
import { Button } from "../button/button.entity";

@Entity()
export class Activity extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;

  @Column({})
  data: string;

  @Column({})
  eventName: string;

  @ManyToOne((type) => User)
  from: User;

  @ManyToOne((type) => User)
  to: User;

  @ManyToOne((type) => Button)
  button: Button;

  @ManyToOne((type) => User)
  consumer: User;

  @Column({default: false})
  outbox: boolean; // if is set to true will be sent on daily mail, and set back to false

  @Column({
    default: false,
  })
  read: boolean

  @Column({default: false})
  homeinfo: boolean;

  @Column({default: true})
  lastActivityButtonConsumer: boolean;

  @Column({default: false})
  lastActivityButtonOwner: boolean;
}