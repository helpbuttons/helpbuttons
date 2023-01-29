import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SetupDto, SetupDtoOut } from './setup.entity';
import * as fs from 'fs';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { configFileName, configFullPath } from '@src/shared/helpers/config.helper';
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

@Injectable()
export class SetupService {
  constructor() {}

  async smtpTest(smtpUrl: string): Promise<any> {
    const transporter = nodemailer.createTransport(smtpUrl);
    await transporter
      .verify()
      .then(() => {
        console.log(`SMTP is OK!`);
        return 'OK';
      })
      .catch((error) => {
        const msg = `Error connecting to smtp: ${JSON.stringify(error)}`;
        console.log(`${HttpStatus.SERVICE_UNAVAILABLE} :: ${msg}`)
        throw new HttpException(msg, HttpStatus.SERVICE_UNAVAILABLE);
      });
  }

  isConfigFileCreated() {
    return fs.existsSync(configFullPath);
  }

  async save(setupDto: SetupDto) {
    if(this.isConfigFileCreated()) {
      throw new HttpException(`Please remove ${configFullPath} before editing the configurations of your server!`, HttpStatus.CONFLICT);
    }

    await this.isDatabaseReady(setupDto);

    fs.writeFileSync(
      configFullPath,
      JSON.stringify({
        ...setupDto,
        ...{ jwtSecret: dbIdGenerator() },
      }),
    );
    console.log(`${configFullPath} written to api`)
    return "OK"
  }

  get(): Promise<SetupDtoOut> {
    if(!this.isConfigFileCreated()){
      throw new HttpException(`${configFullPath} nao existe!`, HttpStatus.BAD_REQUEST);
    }

    const config = require(`../../..${configFileName}`)
    return this.isDatabaseReady(config)
    .then(({migrationsNumber,userCount }) => {
      const dataJSON = fs.readFileSync(configFullPath, 'utf8');
      const data: SetupDto = new SetupDto(JSON.parse(dataJSON));
  
      const dataToWeb : SetupDtoOut= {
        hostName: data.hostName,
        mapifyApiKey: data.mapifyApiKey,
        leafletTiles: data.leafletTiles,
        allowedDomains: data.allowedDomains,
        databaseNumberMigrations: migrationsNumber,
        userCount: userCount
      };
  
      // return JSON.stringify(dataToWeb);
      return dataToWeb;
    });
  }

  async isDatabaseReady(
    setupDto: SetupDto,
  ): Promise<{migrationsNumber :number, userCount :number}> {
    const config = {
      host: setupDto.postgresHostName,
      port: setupDto.postgresPort,
      user: setupDto.postgresUser,
      password: setupDto.postgresPassword,
      database: setupDto.postgresDb,
    };
    const pool = new Pool(config);

    try {
      let poolconnection = await pool.connect();
      const migrationsNumber = await poolconnection.query(`SELECT count(id) from migrations`);

      const userCount = await poolconnection.query(`SELECT count(id) from public.user`);
      return {migrationsNumber: migrationsNumber.rows[0].count, userCount: userCount.rows[0].count};
    } catch (error) {
      console.log(error)
      let msg = `Database connection error: ${error.message}`;

      if (error.code === '42P01') { //need to run migrations
        const msg = `need-migrations`;
        return {migrationsNumber: 0, userCount: 0};
      }
      if (error?.errno === -3008 ) { //need to run migrations
        msg = `db-hostname-error`;
      } 
      if (error?.code === '28P01') 
      {
        msg = `db-connection-error`;
      }
      console.log(`${HttpStatus.SERVICE_UNAVAILABLE} :: ${msg}`)

      throw new HttpException(msg, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
