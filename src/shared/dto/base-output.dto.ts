import { CustomBaseEntity } from '../types';

export class BaseOutputDto {
  id!: string;

  constructor(entity: CustomBaseEntity<string>) {
    this.id = entity.id;
  }
}
