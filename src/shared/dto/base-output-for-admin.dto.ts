import { CustomBaseEntity } from '../types';

export class BaseOutputForAdminDto {
  id!: string;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(entity: CustomBaseEntity<string>) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
