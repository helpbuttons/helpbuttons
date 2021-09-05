import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Button, ButtonRelations} from '../models';

export class ButtonRepository extends DefaultCrudRepository<
  Button,
  typeof Button.prototype.id,
  ButtonRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Button, dataSource);
  }
}
