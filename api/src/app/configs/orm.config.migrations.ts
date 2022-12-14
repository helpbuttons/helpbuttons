import { DataSource } from 'typeorm';
import {OrmConfig} from './orm.config';

export const AppDataSource = new DataSource(
    {
    type: OrmConfig.type,
    host: OrmConfig.host,
    port: OrmConfig.port,
    username: OrmConfig.username,
    password: OrmConfig.password,
    database: OrmConfig.database,
    synchronize: false,
    logging: true, 
    entities: ['src/modules/**/*.entity.{ts,js}'],
    migrations: ["src/data/migrations/*{.ts,.js}"],
    migrationsTableName: "migrations",}
)