import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// const config = {
//   name: 'db',
//   connector: 'memory',
//   localStorage: '',
//   file: './data/db.json'
// };


const config_prod = {
  name: 'db',
  connector: 'postgresql',
  url: 'postgres://postgres:jgda7s8tds78sagda@localhost/postgres',
  host: 'postgres',
  port: 5432,
  user: 'postgres',
  password: 'jgda7s8tds78sagda',
  database: 'postgres'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config_prod;

  constructor(
    @inject('datasources.config_prod.db', {optional: true})
    dsConfig: object = config_prod,
  ) {
    super(dsConfig);
  }
}
