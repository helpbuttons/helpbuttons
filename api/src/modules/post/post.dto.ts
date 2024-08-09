import { MaxLength } from 'class-validator';
import { Column } from 'typeorm';

export class MessageDto {
  @Column({})
  @MaxLength(500, {
    message: 'message is too long',
  })
  message: string;

  images?: string[];
}
