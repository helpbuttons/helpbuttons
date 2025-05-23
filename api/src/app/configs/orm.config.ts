
import { DataSourceOptions } from "typeorm";
import configs from '@src/config/configuration.js';

export const dataSourceOptions:DataSourceOptions = {
    type: 'postgres',
    host: configs().postgresHostName,
    port: configs().postgresPort,
    username: configs().postgresUser,
    password: configs().postgresPassword,
    database: configs().postgresDb,
    entities: ['dist/modules/**/*.entity.js'],
    /* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. */
    // synchronize: true,
    // https://github.com/typeorm/typeorm/issues/3388#issuecomment-673242516
    // extra: {
    //     max: 10,
    //     poolSize: 10,
    //     idle_timeout: 30,
    //     connect_timeout: 30,
    //     connectionTimeoutMillis: 1000,
    // },
}