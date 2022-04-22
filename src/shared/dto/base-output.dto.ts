import { CustomBaseEntity } from '../entity';

export class BaseOutputDto {
  id!: string;

  constructor(entity: CustomBaseEntity<string>) {
    this.id = entity.id;
  }
}
