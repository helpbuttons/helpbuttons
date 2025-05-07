import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SetupDtoOut, SmtpConfigTest } from './setup.entity.js';
import { getConfig } from '@src/shared/helpers/config.helper.js';
import nodemailer from "nodemailer";

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

  get(): Promise<SetupDtoOut> {
    return getConfig();
  }
}
