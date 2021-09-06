import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Button, ButtonRelations, Network, ButtonsNetwork} from '../models';
import {ButtonsNetworkRepository} from './buttons-network.repository';
import {NetworkRepository} from './network.repository';

export class ButtonRepository extends DefaultCrudRepository<
  Button,
  typeof Button.prototype.id,
  ButtonRelations
> {

  public readonly networks: HasManyThroughRepositoryFactory<Network, typeof Network.prototype.id,
          ButtonsNetwork,
          typeof Button.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ButtonsNetworkRepository') protected buttonsNetworkRepositoryGetter: Getter<ButtonsNetworkRepository>, @repository.getter('NetworkRepository') protected networkRepositoryGetter: Getter<NetworkRepository>,
  ) {
    super(Button, dataSource);
    this.networks = this.createHasManyThroughRepositoryFactoryFor('networks', networkRepositoryGetter, buttonsNetworkRepositoryGetter,);
    this.registerInclusionResolver('networks', this.networks.inclusionResolver);
  }
}
