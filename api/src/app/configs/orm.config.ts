
import { configFileName } from "../../shared/helpers/config-name.const";
import { DataSourceOptions } from "typeorm";

var configFile = require(`../../..${configFileName}`);

export const dataSourceOptions:DataSourceOptions = {
    type: 'postgres',
    host: configFile.postgresHostName ? configFile.postgresHostName : 'db',
    port: configFile.postgresPort ? configFile.postgresPort : 5432,
    username: configFile.postgresUser,
    password: configFile.postgresPassword,
    database: configFile.postgresDb,
    entities: ['dist/modules/**/*.entity.js'],
    /* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. */
    // synchronize: true,
    extra: {
        query_timeout: 2500
    },
}