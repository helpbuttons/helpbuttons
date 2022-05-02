import { GenericEntity } from '@src/shared/types/generic.entity';
import {  Column, Entity, PrimaryColumn, PrimaryGeneratedColumn  } from 'typeorm';
// https://stackoverflow.com/a/67557083

@Entity()
export class Tag extends GenericEntity{
  
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