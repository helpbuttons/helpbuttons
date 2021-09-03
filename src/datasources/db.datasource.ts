import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config_prod = {
  name: 'db',
  connector: 'postgresql',
  url: 'postgres://postgres:change_me@postgres/postgres',
  host: 'postgres',
  port: 5432,
  user: 'postgres',
  password: 'change_me',
  database: 'postgres'
};

const config_devel = {
  name: 'db_devel',
  connector: 'memory',
  localStorage: '',
  file: './data/db.json'
};

const config = config_devel;
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
