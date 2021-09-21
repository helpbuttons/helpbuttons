import {Entity, model, property, hasMany} from '@loopback/repository';
import {Network} from './network.model';
import {ButtonsNetwork} from './buttons-network.model';

@model()
export class Button extends Entity {
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
    required: true,
  })
  type: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  tags?: string[];

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'object',
    required: true,
  })
  geoPlace?: object;

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
  
  @property({
    type: 'string'
  })
  owner: string;

  @hasMany(() => Network, {through: {model: () => ButtonsNetwork}})
  networks: Network[];

  @property({
    type: 'number',
  })
  templateButtonId?: number;

  constructor(data?: Partial<Button>) {
    super(data);
  }
}

export interface ButtonRelations {
  // describe navigational properties here
}

export type ButtonWithRelations = Button & ButtonRelations;
