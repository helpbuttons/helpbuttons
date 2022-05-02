import { GenericEntity } from '@src/shared/types/generic.entity';
import {  Column, Entity, PrimaryColumn  } from 'typeorm';
// https://stackoverflow.com/a/67557083

@Entity()
export class Button extends GenericEntity{
  
  @Column({})
  @PrimaryColumn()
  public id: string;
  
  @Column({})
  name?: string;

  @Column({})
  description: string;

  @Column({type: 'double precision'})
  public latitude: number;
 
  @Column({type: 'double precision'})
  public longitude: number;

  @Column({type: 'geography'})
  location: string;

  @Column("text", {array: true})
  tags?: string[];

  // missing, network relations, template, owner, tags
}