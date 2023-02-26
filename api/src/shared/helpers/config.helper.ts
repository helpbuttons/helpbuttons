import { HttpException, HttpStatus } from '@nestjs/common';
import {
  SetupDto,
  SetupDtoOut,
} from '@src/modules/setup/setup.entity';
import * as fs from 'fs';
import { version } from '../commit';
const { Pool } = require('pg');

export const configFileName: string = '/config/config.json';
export const configFullPath: string = `.${configFileName}`;

export const isConfigFileCreated = async () => {
  return fs.existsSync(configFullPath);
};

export const checkDatabase = async (
  config,
): Promise<{
  migrationsNumber: number;
  userCount: number;
  buttonCount: number;
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
    const buttonCount = await poolconnection.query(
      `SELECT count(id) from button`,
    );

    return {
      migrationsNumber: migrationsNumber.rows[0].count,
      userCount: userCount.rows[0].count,
      buttonCount: buttonCount.rows[0].count,
    };
  } catch (error) {
    let msg = `Database connection error: ${error.message}`;

    if (error.code === '42P01') {
      //need to run migrations
      const msg = `need-migrations`;
      return {
        migrationsNumber: 0,
        userCount: 0,
        buttonCount: 0,
      };
    }
    if (error?.errno === -3008) {
      //need to run migrations
      msg = `db-hostname-error`;
    }
    if (error?.code === '28P01') {
      msg = `db-connection-error`;
    }
    if(error?.code === '42P01') {}
    console.log(`${HttpStatus.SERVICE_UNAVAILABLE} :: ${msg}`);

    throw new HttpException(msg, HttpStatus.SERVICE_UNAVAILABLE);
  }

  
};


export const getConfig = async () => {
  if (!await isConfigFileCreated()) {
    throw new HttpException(
      `${configFullPath} nao existe!`,
      HttpStatus.BAD_REQUEST,
    );
  }

  const config = require(`../../..${configFileName}`);

  return checkDatabase(config).then(
    ({ migrationsNumber, userCount, buttonCount }) => {
      const dataJSON = fs.readFileSync(configFullPath, 'utf8');
      const data: SetupDto = new SetupDto(JSON.parse(dataJSON));

      const dataToWeb: SetupDtoOut = {
        hostName: data.hostName,
        mapifyApiKey: data.mapifyApiKey,
        leafletTiles: data.leafletTiles,
        allowedDomains: data.allowedDomains,
        databaseNumberMigrations: migrationsNumber,
        userCount: userCount,
        buttonCount: buttonCount,
        commit: version.git
      };

      return dataToWeb;
    },
  );
};