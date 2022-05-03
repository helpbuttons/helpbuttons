import { GenericEntity } from '@src/shared/types/generic.entity';
import {  Column, Entity, PrimaryColumn  } from 'typeorm';

@Entity()
export class Network extends GenericEntity{
  
  @Column({})
  @PrimaryColumn()
  public id: string;
  
  @Column({})
  name?: string;

  @Column({})
  description: string;

  @Column({})
  url?: string;

//   @Column({}) TODO
//   privacy?: string;

//   @Column({}) TODO
//   avatar?: string;

  @Column({type: 'double precision'})
  radius: number;

  @Column({type: 'double precision'})
  public latitude: number;
 
  @Column({type: 'double precision'})
  public longitude: number;

  @Column({type: 'geography'})
  location: string;

  @Column("text", {array: true})
  tags?: string[];

  // missing, templates, buttons, friendNetworks, owner
}