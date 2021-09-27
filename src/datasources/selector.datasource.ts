require('dotenv').config()

const memoryDatasource = {
    "name": "db",
    "connector": "memory",
    "localStorage": "",
    "file": "./data/db.json"
};

const postgresDatasource = {
    "name": "db",
    "connector": "postgresql",
    "url": "",
    "host": process.env.POSTGRES_HOSTNAME,
    "port": "5432",
    "user": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB
};

export const datasourceConfig = (process.env.NODE_ENV === 'memory') ? memoryDatasource : postgresDatasource;