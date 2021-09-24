import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { logger } from '../logger';
import {datasourceConfig} from './selector.datasource';
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = datasourceConfig;

  constructor(
    @inject('datasources.datasourceConfig.db', {optional: true})
    dsConfig: object = datasourceConfig,
  ) {
    logger.info('Starting: ' + datasourceConfig.connector);
    
    super(dsConfig);
  }
}
