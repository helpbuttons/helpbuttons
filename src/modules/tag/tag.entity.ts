import { BaseEntity } from '@src/shared/types/base.entity';
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

  @PrimaryColumn()
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
