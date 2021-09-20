import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ButtonsNetwork, ButtonsNetworkRelations} from '../models';

export class ButtonsNetworkRepository extends DefaultCrudRepository<
  ButtonsNetwork,
  typeof ButtonsNetwork.prototype.id,
  ButtonsNetworkRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ButtonsNetwork, dataSource);
    
    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.modified = new Date();
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */ 
  }
}
