import {  Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { BaseEntity } from '@src/shared/types/base.entity';
import { User } from "../user/user.entity";

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
  owner: User;

  @Column({default: false})
  outbox: boolean; // if is set to true will be sent on daily mail, and set back to false

  @Column({
    default: false,
  })
  read: boolean
}
