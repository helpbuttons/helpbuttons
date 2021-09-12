import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Role, RoleRelations} from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Role, dataSource);
  }
}
