import {TypeOrmModuleOptions} from "@nestjs/typeorm";

var configFile = require('../../../config.json');

export const typeOrmModuleOptions:TypeOrmModuleOptions = {
    type: 'postgres',
    host: configFile.postgresHostName ? configFile.postgresHostName : 'db',
    port: configFile.postgresPort ? configFile.postgresPort : 5432,
    username: configFile.postgresUser,
    password: configFile.postgresPassword,
    database: configFile.postgresDb,
    /* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. */
    // synchronize: true,
    autoLoadEntities: true,
}

export const OrmConfig = {
    ...typeOrmModuleOptions,
    migrationsTableName: "migrations",
    migrations: ["src/data/migrations/*{.ts,.js}"],
    seeds: ['src/data/seeds/*.seed.{ts,js}'],
    factories: ['src/data/factories/*{.ts,.js}'],
    cli: {
        "migrationsDir": "src/data/migrations"
    },
    entities: [
        'src/modules/**/*.entity.{ts,js}',
    ],
};
export default OrmConfig;
