import { DataSource } from 'typeorm';
import { dataSourceOptions } from './orm.config';

export default new DataSource({
  ...dataSourceOptions,
  entities: ['src/modules/**/*.entity.{ts,js}'],
  migrationsTableName: 'migrations',
  migrations: ['src/data/migrations/*{.ts,.js}'],
});
