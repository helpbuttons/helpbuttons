import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Tag, TagRelations} from '../models';

export class TagRepository extends DefaultCrudRepository<
  Tag,
  typeof Tag.prototype.id,
  TagRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Tag, dataSource);
    
    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.modified = new Date();
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */ 
  }
}
