import {Entity, model, property, hasMany} from '@loopback/repository';
import {Button} from './button.model';
import {ButtonsNetwork} from './buttons-network.model';
import { TemplateButtonNetwork } from './template-button-network.model';
import {TemplateButton} from './template-button.model';

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
    type: 'object',
    required: true,
  })
  geoPlace?: object;

  @property({
    type: 'number',
  })
  radius?: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  tags?: string[];

  @property({
    type: 'string'
  })
  owner: string;

  @property({
    type: 'array',
    itemType: 'number',
  })
  friendNetworks?: number[];

  @hasMany(() => Button, {through: {model: () => ButtonsNetwork}})
  buttons: Button[];

  // TODO this should be a relation with roles
  @hasMany(() => TemplateButton, {through: {model: () => TemplateButtonNetwork}})
  templateButtons: TemplateButton[];

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
  
  // TODO: this will have a list of users blocked in a network
  // blockedUsers?: string[];

  constructor(data?: Partial<Network>) {
    super(data);
  }
}

export interface NetworkRelations {
  // describe navigational properties here
}

export type NetworkWithRelations = Network & NetworkRelations;
