import { BaseEntity } from '@src/shared/types/base.entity';
import {  Column, Entity, PrimaryColumn, PrimaryGeneratedColumn  } from 'typeorm';
// https://stackoverflow.com/a/67557083

@Entity()
export class Tag extends BaseEntity{
  
  @Column({})
  @PrimaryColumn()
  public tag: string;
  
  @Column({})
  @PrimaryColumn()
  modelName?: string;
  
  @Column({})
  @PrimaryColumn()
  modelId?: string;
}