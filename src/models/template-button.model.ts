import {Entity, model, property, hasMany} from '@loopback/repository';
import {Button} from './button.model';
import {Network} from './network.model';
import {TemplateButtonsTypes} from './enums';
import { TemplateButtonNetwork } from './template-button-network.model';

@model()
export class TemplateButton extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(TemplateButtonsTypes),
    },
    required: true
  })
  type?: string;

  @property({
    type: 'object',
    required: true,
  })
  fields: object;

  @property({
    type: 'date',
    default: () => new Date()
  })
  created ? : string;
  
  @property({
    type: 'date',
    default: () => new Date()
  })
  modified ? : string;
  
  @hasMany(() => Button)
  buttons: Button[];

  @hasMany(() => Network, {through: {model: () => TemplateButtonNetwork}})
  networks: Network[];

  constructor(data?: Partial<TemplateButton>) {
    super(data);
  }
}

export interface TemplateButtonRelations {
  // describe navigational properties here
}

export type TemplateButtonWithRelations = TemplateButton & TemplateButtonRelations;
