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
        throw new HttpException(error, HttpStatus.UNAUTHORIZED);
      });
  }

  async save(setupDto: SetupDto) {
    fs.writeFileSync(
      'config.json',
      JSON.stringify({
        ...setupDto,
        ...{ jwtSecret: dbIdGenerator() },
      }),
    );
  }

  get() {
    const dataJSON = fs.readFileSync('config.json', 'utf8');
    const data: SetupDto = new SetupDto(JSON.parse(dataJSON));

    const dataToWeb = {
      hostName: data.hostName,
      mapifyApiKey: data.mapifyApiKey,
      leafletTiles: data.leafletTiles,
      allowedDomains: data.allowedDomains,
    };

    return JSON.stringify(dataToWeb);
  }

  async isDatabaseReady(
    setupDto: SetupDto,
  ): Promise<{ message: string; code: number }> {
    const config = {
      host: setupDto.postgresHostName,
      port: setupDto.postgresPort,
      user: setupDto.postgresUser,
      password: setupDto.postgresPassword,
      database: setupDto.postgresDb,
    };
    const pool = new Pool(config);

    try {
      await pool.connect();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    return Promise.resolve({
      message: `OK`,
      code: HttpStatus.ACCEPTED,
    });
  }
}
