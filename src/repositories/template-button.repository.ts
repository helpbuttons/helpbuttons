import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TemplateButton, TemplateButtonRelations, Button, TemplateButtonNetwork, Network} from '../models';
import {ButtonRepository} from './button.repository';
import {TemplateButtonNetworkRepository} from './template-button-network.repository';
import {NetworkRepository} from './network.repository';

export class TemplateButtonRepository extends DefaultCrudRepository<
  TemplateButton,
  typeof TemplateButton.prototype.id,
  TemplateButtonRelations
> {

  public readonly buttons: HasManyRepositoryFactory<Button, typeof TemplateButton.prototype.id>;
  public readonly networks: HasManyThroughRepositoryFactory<Network, typeof Network.prototype.id,
  TemplateButtonNetwork,
  typeof TemplateButton.prototype.id
>;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ButtonRepository') protected buttonRepositoryGetter: Getter<ButtonRepository>,
    
    @repository.getter('TemplateButtonNetworkRepository') protected templateButtonNetworkRepositoryGetter: Getter<TemplateButtonNetworkRepository>, 
    
    @repository.getter('NetworkRepository') protected networkRepositoryGetter: Getter<NetworkRepository>,
  ) {
    super(TemplateButton, dataSource);
    this.buttons = this.createHasManyRepositoryFactoryFor('buttons', buttonRepositoryGetter,);
    this.registerInclusionResolver('buttons', this.buttons.inclusionResolver);

    this.networks = this.createHasManyThroughRepositoryFactoryFor('networks', networkRepositoryGetter, templateButtonNetworkRepositoryGetter,);
    this.registerInclusionResolver('networks', this.networks.inclusionResolver);

    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.modified = new Date();
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */ 
  }

  public isOwner(userId: string, id: number){
    
    return this.find({"where": {"id": id,"owner": userId}, "fields": {"id": true}}).then((items) => {
      if(items && items.length > 0) {
        return true;
      }
      return false;
    });
  }
}
