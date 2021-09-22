import { inject, Getter } from '@loopback/core';
import { DefaultCrudRepository, repository, HasManyThroughRepositoryFactory } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Network, NetworkRelations, Button, ButtonsNetwork, TemplateButton, TemplateButtonNetwork } from '../models';
import { ButtonsNetworkRepository } from './buttons-network.repository';
import { ButtonRepository } from './button.repository';
import { TemplateButtonRepository } from './template-button.repository';
import { TemplateButtonNetworkRepository } from './template-button-network.repository';
import { GeoJSON } from 'geojson';

export class NetworkRepository extends DefaultCrudRepository<
  Network,
  typeof Network.prototype.id,
  NetworkRelations
> {

  public readonly buttons: HasManyThroughRepositoryFactory<Button, typeof Button.prototype.id,
    ButtonsNetwork,
    typeof Network.prototype.id
  >;

  public readonly templateButtons: HasManyThroughRepositoryFactory<TemplateButton, typeof TemplateButton.prototype.id, TemplateButtonNetwork, typeof Network.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,

    @repository.getter('ButtonsNetworkRepository') protected buttonsNetworkRepositoryGetter: Getter<ButtonsNetworkRepository>,

    @repository.getter('ButtonRepository') protected buttonRepositoryGetter: Getter<ButtonRepository>,

    @repository.getter('TemplateButtonNetworkRepository') protected templateButtonNetworkRepositoryGetter: Getter<TemplateButtonNetworkRepository>,

    @repository.getter('TemplateButtonRepository') protected templateButtonRepositoryGetter: Getter<TemplateButtonRepository>,
  ) {
    super(Network, dataSource);

    this.templateButtons = this.createHasManyThroughRepositoryFactoryFor('templateButtons',
      templateButtonRepositoryGetter,
      templateButtonNetworkRepositoryGetter,);

    this.registerInclusionResolver('templateButtons', this.templateButtons.inclusionResolver);

    this.buttons = this.createHasManyThroughRepositoryFactoryFor('buttons', buttonRepositoryGetter, buttonsNetworkRepositoryGetter,);
    this.registerInclusionResolver('buttons', this.buttons.inclusionResolver);

    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.modified = new Date();
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */ 
  }

  public findOwnerNetworks(userId: string, networkIds: number[]){
    
    return this.find({"where": {"id": {"inq": networkIds},"owner": userId}, "fields": {"id": true}}).then(
      (networks) => {
        return networks.map((network) => {
          return network.id;
        });
      }
    );
  }

  public isOwner(userId: string, networkId: number){
    
    return this.find({"where": {"id": networkId,"owner": userId}, "fields": {"id": true}}).then((networks) => {
      console.log(networks);
      if(networks && networks.length > 0) {
        return true;
      }
      return false;
    }).catch((err)=> {
      console.log('Error at network repository checking ownership of a network.... ' + err);
      return false;
    });
  }

  public findForMap(geoPolygon: GeoJSON): Promise<Network[]> {
    const sql:string = `SELECT id
                      FROM network
                      WHERE
                        ST_Within(ST_GeomFromGeoJSON(geoplace),ST_GeomFromGeoJSON(
                                    '`+ JSON.stringify(geoPolygon) + `'
                                    ));`
    return this.execute(sql).then(res => {
      const networkIds = res.map(function (networkId : {"id": "number"}) {
        return networkId.id;
      });
      return this.find({where: {id: {inq: networkIds}}});
    });
  }
}
