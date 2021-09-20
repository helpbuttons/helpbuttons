import {Entity, model, property} from '@loopback/repository';

@model()
export class UserExtra extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  interests?: string[];

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
  
  constructor(data?: Partial<UserExtra>) {
    super(data);
  }
}

export interface UserExtraRelations {
  // describe navigational properties here
}

export type UserExtraWithRelations = UserExtra & UserExtraRelations;
