import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {Error: bad inputDataSource} from '../datasources';
import {UserExtra, UserExtraRelations} from '../models';

export class UserExtraRepository extends DefaultCrudRepository<
  UserExtra,
  typeof UserExtra.prototype.id,
  UserExtraRelations
> {
  constructor(
    @inject('datasources.') dataSource: Error: bad inputDataSource,
  ) {
    super(UserExtra, dataSource);
  }
}
