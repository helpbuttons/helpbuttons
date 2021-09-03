import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Network, NetworkRelations} from '../models';
import {toSlug} from './utils';

export class NetworkRepository extends DefaultCrudRepository<
  Network,
  typeof Network.prototype.id,
  NetworkRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Network, dataSource);
  }

  new(networkInstance: {
    name: string;
    url: string;
    avatar: string;
    description: string;
    privacy: string;
    place: string;
    latitude: number;
    longitude: number;
    radius: number;
    template: object;
}) {
    return {token: toSlug(networkInstance.name)};
  }
}
