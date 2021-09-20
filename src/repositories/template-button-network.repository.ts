import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TemplateButtonNetwork, TemplateButtonNetworkRelations} from '../models';

export class TemplateButtonNetworkRepository extends DefaultCrudRepository<
  TemplateButtonNetwork,
  typeof TemplateButtonNetwork.prototype.id,
  TemplateButtonNetworkRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TemplateButtonNetwork, dataSource);

    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.modified = new Date();
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */ 
  }
}
