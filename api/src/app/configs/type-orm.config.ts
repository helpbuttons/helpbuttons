import { DataSource } from 'typeorm';
import { dataSourceOptions } from './orm.config.js';

export default new DataSource({
  ...dataSourceOptions,
  migrationsTableName: 'migrations',
  migrations: ['src/data/migrations/*{.ts,.js}'],
});
