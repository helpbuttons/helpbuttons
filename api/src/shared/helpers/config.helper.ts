import { HttpException, HttpStatus } from '@nestjs/common';
import configs from '@src/config/configuration';
import { SetupDtoOut } from '@src/modules/setup/setup.entity';

const { Pool } = require('pg');

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
      const { hostname } = new URL(data.hostName);

      const dataToWeb: SetupDtoOut = {
        hostName: data.hostName,
        allowedDomains: [],
        databaseNumberMigrations: migrationsNumber,
        userCount: userCount,
        commit: 'todo',
      };

      return dataToWeb;
    },
  );
};
