import { BaseEntity } from '@src/shared/types/base.entity.js';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ImageFile extends BaseEntity {
  @Column({})
  @PrimaryColumn()
  public id: string;
  
  @Column({})
  name: string;
    
  @Column({})
  mimetype: string;

  @Column({})
  originalname: string;
}
