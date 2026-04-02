import { MaxLength } from 'class-validator';
import { Column } from 'typeorm';
import { Post } from './post.entity';

export class MessageDto {
  @Column({})
  @MaxLength(500, {
    message: 'message is too long',
  })
  message: string;

  images?: string[];
}