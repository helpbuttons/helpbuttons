import {  Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { BaseEntity } from '@src/shared/types/base.entity';

import { Button } from "../button/button.entity";
import { User } from "../user/user.entity";
import { Comment } from "./comment.entity";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class Post extends BaseEntity {
  
  @Expose()
  @Column({})
  @PrimaryColumn()
  public id: string;

  @Expose()
  @Column({})
  message: string;

  @Expose()
  @ManyToOne((type) => User)
  author: User;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @Expose()
  @ManyToOne(() => Button, (button) => button.feed)
  button: Button;

  @Expose()
  @Column('boolean', {default: false})
  deleted: boolean;

  @Expose()
  @Column('text', { array: true, nullable: true })
  images: string[];
}
