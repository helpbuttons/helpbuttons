import {  Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { BaseEntity } from '@src/shared/types/base.entity';
import { User } from "../user/user.entity";
import { GroupMessageType } from "@src/shared/types/group-message.enum";

@Entity()
export class GroupMessage extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;

  @ManyToOne((type) => User)
  from: User;

  @Column({
    type: 'enum',
    enum: GroupMessageType,
    default: GroupMessageType.community,
    nullable: true,
  })
  to: GroupMessageType;

  @Column({default: false})
  last: boolean;

  @Column({})
  message: string;
}