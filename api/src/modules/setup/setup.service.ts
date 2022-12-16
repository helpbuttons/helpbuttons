import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SetupDto } from './setup.entity';
import * as fs from 'fs';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
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
    return fs.existsSync('config.json');
  }

  async save(setupDto: SetupDto) {
    if(this.isConfigFileCreated()) {
      throw new HttpException(`Please remove config.json before editing the configurations of your server!`, HttpStatus.CONFLICT);
    }

    await this.isDatabaseReady(setupDto);

    fs.writeFileSync(
      'config.json',
      JSON.stringify({
        ...setupDto,
        ...{ jwtSecret: dbIdGenerator() },
      }),
    );
    console.log('config.json written to api')
    // throw new Error('config.json created, restart backend please.')
    return "OK"
  }

  async get() {
    if(!this.isConfigFileCreated()){
      throw new HttpException(`config.json nao existe!`, HttpStatus.BAD_REQUEST)
    }

    const config = require('../../../config.json')
    const numberMigrations = await this.isDatabaseReady(config);
   
    const dataJSON = fs.readFileSync('config.json', 'utf8');
    const data: SetupDto = new SetupDto(JSON.parse(dataJSON));

    const dataToWeb = {
      hostName: data.hostName,
      mapifyApiKey: data.mapifyApiKey,
      leafletTiles: data.leafletTiles,
      allowedDomains: data.allowedDomains,
      databaseNumberMigrations: numberMigrations,
    };

    return JSON.stringify(dataToWeb);
  }

  async isDatabaseReady(
    setupDto: SetupDto,
  ): Promise<number> {
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
      const databaseMigrations = await poolconnection.query(`SELECT id from migrations`);
      return databaseMigrations.rowCount;
    } catch (error) {
      
      if (error.code === '42P01') { //need to run migrations
        const msg = `Database connection error: ${error.message}`;
        return 0;
      } 
      const msg = `Database connection error: ${error.message}`;
      console.log(`${HttpStatus.SERVICE_UNAVAILABLE} :: ${msg}`)

      throw new HttpException(msg, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
