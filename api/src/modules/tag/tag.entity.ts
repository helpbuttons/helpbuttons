import { BaseEntity } from '@src/shared/types/base.entity.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';
// https://stackoverflow.com/a/67557083

// FIXME:
@Entity({
  name: 'tags',
})
export class Tag extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    generated: false,
  })
  id?: string;

  @Column()
  tag: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  modelName?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  modelId?: string;
}
