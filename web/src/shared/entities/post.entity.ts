import {  Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { BaseEntity } from '@src/shared/types/base.entity';

import { Button } from "../button/button.entity";
import { User } from "../user/user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Post extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;

  @Column({})
  message: string;

  @ManyToOne((type) => User)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @ManyToOne(() => Button, (button) => button.feed)
  button: Button;

  @Column('boolean', {default: false})
  deleted: boolean;
}
