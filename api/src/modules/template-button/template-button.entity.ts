import { BaseEntity } from '@src/shared/types/base.entity.js';
import {  Column, Entity, PrimaryColumn  } from 'typeorm';
// https://stackoverflow.com/a/67557083

export enum TemplateButtonType {
  need = 'need',
  exchange = 'exchange',
  offer = 'offer'
}

@Entity()
export class TemplateButton extends BaseEntity{
  
  @Column({})
  @PrimaryColumn()
  public id: string;
  
  @Column({})
  name?: string;

  @Column({})
  description: string;

  @Column({
    type: "enum",
    enum: TemplateButtonType,
   })
  type: TemplateButtonType;

  @Column({})
  formFields: string;

  //TODO: missing: owner, 
}