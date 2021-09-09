import {Entity, model, property, hasMany} from '@loopback/repository';
import {Button} from './button.model';

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
    type: 'object',
    required: true,
  })
  schema: object;

  @hasMany(() => Button)
  buttons: Button[];

  constructor(data?: Partial<TemplateButton>) {
    super(data);
  }
}

export interface TemplateButtonRelations {
  // describe navigational properties here
}

export type TemplateButtonWithRelations = TemplateButton & TemplateButtonRelations;
