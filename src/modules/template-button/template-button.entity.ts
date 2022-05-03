import { GenericEntity } from '@src/shared/types/generic.entity';
import {  Column, Entity, PrimaryColumn  } from 'typeorm';
// https://stackoverflow.com/a/67557083

export enum TemplateButtonType {
  need = 'need',
  exchange = 'exchange',
  offer = 'offer'
}

@Entity()
export class TemplateButton extends GenericEntity{
  
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