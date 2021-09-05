import {Entity, model, property} from '@loopback/repository';

@model()
export class Network extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  url?: string;

  @property({
    type: 'string',
  })
  avatar?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    default: 'private',
  })
  privacy?: string;

  @property({
    type: 'string',
  })
  place?: string;

  @property({
    type: 'number',
  })
  latitude?: number;

  @property({
    type: 'number',
  })
  longitude?: number;

  @property({
    type: 'number',
  })
  radius?: number;

  @property({
    type: 'object',
    required: true,
  })
  template: object;


  constructor(data?: Partial<Network>) {
    super(data);
  }
}

export interface NetworkRelations {
  // describe navigational properties here
}

export type NetworkWithRelations = Network & NetworkRelations;
