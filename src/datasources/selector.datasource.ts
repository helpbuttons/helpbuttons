const memoryDatasource = {
    "name": "db",
    "connector": "memory",
    "localStorage": "",
    "file": "./data/db.json"
};

const postgresDatasource = {
    "name": "db",
    "connector": "postgresql",
    "url": "postgres://postgres:jgda7s8tds78sagda@localhost/postgres",
    "host": "postgres",
    "port": "5432",
    "user": "postgres",
    "password": "jgda7s8tds78sagda",
    "database": "postgres"
};

export const datasourceConfig = (process.env.NODE_ENV === 'memory') ? memoryDatasource : postgresDatasource;