import {Entity, model, property} from '@loopback/repository';

@model()
export class UserExtra extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;


  constructor(data?: Partial<UserExtra>) {
    super(data);
  }
}

export interface UserExtraRelations {
  // describe navigational properties here
}

export type UserExtraWithRelations = UserExtra & UserExtraRelations;
