import { Expose } from 'class-transformer';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';

export class BaseEntity {
  @Expose()
  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  // tslint:disable-next-line: variable-name
  created_at?: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  // tslint:disable-next-line: variable-name
  updated_at?: Date;
}
