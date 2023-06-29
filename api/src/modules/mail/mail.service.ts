import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { configFileName } from '@src/shared/helpers/config-name.const';
// import { template } from './mail.module';
const config = require(`../../..${configFileName}`);

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationEmail({
    to,
    cc,
    bcc,
    activationUrl,
  }: {
    to: string;
    cc?: string;
    bcc?: string;
    activationUrl: string;
  }) {
    const subject = 'Please verify your account';
    const template = 'activation-account';

    return this.mailerService.sendMail({
      to,
      cc,
      bcc,
      from: config.from,
      subject,
      template,
      context: { activationUrl },
    });
  }

  async sendLoginTokenEmail({
    to,
    cc,
    bcc,
    activationUrl,
  }: {
    to: string;
    cc?: string;
    bcc?: string;
    activationUrl: string;
  }) {
    const subject = 'You requested a one-click login';
    const template = 'login-token';

    return await this.mailerService.sendMail({
      to,
      cc,
      bcc,
      from: config.from,
      subject,
      template,
      context: { activationUrl },
    });
  }
  
}
