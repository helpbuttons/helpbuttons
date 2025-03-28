import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";
import { BaseEntity } from "@src/shared/types/base.entity";
import { PrivacyType } from "@src/shared/types/privacy.enum";

@Entity()
export class Comment extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;

  @Column({})
  message: string;

  @ManyToOne(() => Post, (post) => post.id)
  post: Post;

  @ManyToOne((author) => User)
  author: User;

  @Column('boolean', {default: false})
  deleted: boolean;

  @Column({
    type: 'enum',
    enum: PrivacyType,
    default: PrivacyType.PUBLIC,
  })
  privacy: PrivacyType;

  @Column({default: null})
  commentParentId?: string;

  @Column('text', { array: true, default: [] })
  images: string[];
}
