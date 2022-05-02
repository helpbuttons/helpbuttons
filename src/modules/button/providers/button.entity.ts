import {  Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn  } from 'typeorm';
// https://stackoverflow.com/a/67557083

@Entity()
export class Button {
  
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

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date;

  // missing, network relations, template, owner, tags
}