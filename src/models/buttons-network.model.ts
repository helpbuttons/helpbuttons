import {Entity, model, property} from '@loopback/repository';

@model()
export class ButtonsNetwork extends Entity {
  @property({
    type: 'number',
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    id: true,
  })
  networkId?: number;

  @property({
    type: 'number',
    id: true,
  })
  buttonId?: number;

  constructor(data?: Partial<ButtonsNetwork>) {
    super(data);
  }
}

export interface ButtonsNetworkRelations {
  // describe navigational properties here
}

export type ButtonsNetworkWithRelations = ButtonsNetwork & ButtonsNetworkRelations;
