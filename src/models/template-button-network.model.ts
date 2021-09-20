import {Entity, model, property} from '@loopback/repository';

@model()
export class TemplateButtonNetwork extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  networkId?: number;

  @property({
    type: 'number',
  })
  templateButtonId?: number;

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
  
  constructor(data?: Partial<TemplateButtonNetwork>) {
    super(data);
  }
}

export interface TemplateButtonNetworkRelations {
  // describe navigational properties here
}

export type TemplateButtonNetworkWithRelations = TemplateButtonNetwork & TemplateButtonNetworkRelations;
