import { HttpException, HttpStatus } from '@nestjs/common';
import configs from '@src/config/configuration';
import { SetupDtoOut } from '@src/modules/setup/setup.entity';

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

export const checkMigrations = async (config): Promise<void> => {
  const pool = new Pool({
    host: config.postgresHostName,
    port: config.postgresPort,
    user: config.postgresUser,
    password: config.postgresPassword,
    database: config.postgresDb,
  });

  const poolconnection = await pool.connect();
  try {
    const executedMigrations = await poolconnection.query(
      'SELECT name FROM migrations'
    );

    const migrationsDir = path.join(__dirname, '../../data/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.ts'))
    const executedCount = executedMigrations.rows.length;
    const expectedCount = migrationFiles.length;

    if (executedCount < expectedCount) {
      console.error('ERROR: Not all migrations have been run!');
      console.error('Please run $ yarn migration:run')
      process.exit(1);
    }

  } finally {
    poolconnection.release();
    await pool.end();
  }
};

export const checkDatabase = async (
  config,
): Promise<{
  migrationsNumber: number;
  userCount: number;
}> => {
  try {
    const pool = new Pool({
      host: config.postgresHostName,
      port: config.postgresPort,
      user: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDb,
    });
    let poolconnection = await pool.connect();
    const migrationsNumber = await poolconnection.query(
      `SELECT count(id) from migrations`,
    );

    const userCount = await poolconnection.query(
      `SELECT count(id) from public.user`,
    );
    poolconnection.release();
    return {
      migrationsNumber: migrationsNumber.rows[0].count,
      userCount: userCount.rows[0].count,
    };
  } catch (error) {
    let msg = `Database connection error: ${error.message}`;

    if (error.code === '42P01') {
      //need to run migrations
      const msg = `need-migrations`;
      return {
        migrationsNumber: 0,
        userCount: 0,
      };
    }
    if (error?.errno === -3008) {
      //need to run migrations
      msg = `db-hostname-error`;
    }
    if (error?.code === '28P01') {
      msg = `db-connection-error`;
    }
    if (error?.code === '42P01') {
    }
    console.log(`${HttpStatus.SERVICE_UNAVAILABLE} :: ${msg}`);
    console.log(JSON.stringify(error));

    throw new HttpException(msg, HttpStatus.SERVICE_UNAVAILABLE);
  }
};
export const getConfig = async () => {
  return checkDatabase(configs()).then(
    ({ migrationsNumber, userCount }) => {
      const data = configs();

      const dataToWeb: SetupDtoOut = {
        hostName: data.hostName,
        allowedDomains: [],
        databaseNumberMigrations: migrationsNumber,
        userCount: userCount,
        commit: 'todo',
        vapidPublicKey: configs().vapidPublicKey
      };

      return dataToWeb;
    },
  );
};
