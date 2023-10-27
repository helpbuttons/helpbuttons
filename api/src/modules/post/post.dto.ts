import { MaxLength } from 'class-validator';
import { Column } from 'typeorm';

export class MessageDto {
  @Column({})
  @MaxLength(255, {
    message: 'message is too long',
  })
  message: string;
}
