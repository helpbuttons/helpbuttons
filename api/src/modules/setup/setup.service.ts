import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SetupDto, SetupDtoOut, SmtpConfigTest } from './setup.entity';
import * as fs from 'fs';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { checkDatabase, configFullPath, getConfig, isConfigFileCreated } from '@src/shared/helpers/config.helper';
const nodemailer = require('nodemailer');

@Injectable()
export class SetupService {
  constructor(
  ) {}

  async smtpTest(smtpConfig: SmtpConfigTest): Promise<any> {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.smtpHost,
      port: smtpConfig.smtpPort,
      auth:
      {
        user: smtpConfig.smtpUser,
        pass: smtpConfig.smtpPass
      }
    });
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

  async save(setupDto: SetupDto) {
    if(await isConfigFileCreated()) {
      throw new HttpException(`Please remove ${configFullPath} before editing the configurations of your server!`, HttpStatus.CONFLICT);
    }

    await checkDatabase(setupDto);

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
    return getConfig();
  }
}
