import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

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
    const from = 'info@helpbuttons.org';
    const template = 'activation-account';

    await this.mailerService.sendMail({
      to,
      cc,
      bcc,
      from,
      subject,
      template,
      context: { activationUrl },
    });
  }
}
