import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const typeOrmModuleOptions:TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOSTNAME,
    port: parseInt(<string>process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [
        'dist/modules/**/*.entity.{ts,js}',
    ],
    /* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. */
    // synchronize: true,
    autoLoadEntities: true,
}

export const OrmConfig = {
    ...typeOrmModuleOptions,
    migrationsTableName: "migrations",
    migrations: ["dist/data/migrations/*.js"],
    seeds: ['src/data/seeds/*{.ts,.js}'],
    factories: ['src/data/factories/*{.ts,.js}'],
    cli: {
        "migrationsDir": "src/data/migrations"
    }
};
export default OrmConfig;