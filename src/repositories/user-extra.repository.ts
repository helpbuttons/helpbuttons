import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserExtra, UserExtraRelations} from '../models';

export class UserExtraRepository extends DefaultCrudRepository<
  UserExtra,
  typeof UserExtra.prototype.id,
  UserExtraRelations
> {

  constructor(
    @inject('datasources.db') dataSource: DbDataSource
  ) {
    super(UserExtra, dataSource);
  }

  public createForUser(userExtra: object, userId: string) {
    userExtra = {...userExtra, id: userId};
    return this.create(userExtra);
  }
}
