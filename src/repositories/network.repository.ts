import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Network, NetworkRelations, Button, ButtonsNetwork} from '../models';
import {ButtonsNetworkRepository} from './buttons-network.repository';
import {ButtonRepository} from './button.repository';

export class NetworkRepository extends DefaultCrudRepository<
  Network,
  typeof Network.prototype.id,
  NetworkRelations
> {

  public readonly buttons: HasManyThroughRepositoryFactory<Button, typeof Button.prototype.id,
          ButtonsNetwork,
          typeof Network.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ButtonsNetworkRepository') protected buttonsNetworkRepositoryGetter: Getter<ButtonsNetworkRepository>, @repository.getter('ButtonRepository') protected buttonRepositoryGetter: Getter<ButtonRepository>,
  ) {
    super(Network, dataSource);
    this.buttons = this.createHasManyThroughRepositoryFactoryFor('buttons', buttonRepositoryGetter, buttonsNetworkRepositoryGetter,);
    this.registerInclusionResolver('buttons', this.buttons.inclusionResolver);
  }
}
