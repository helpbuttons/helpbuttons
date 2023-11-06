import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { GlobalVarHelper } from '@src/shared/helpers/global-var.helper';
import { NetworkService } from '../network/network.service';
import { configFileName } from '@src/shared/helpers/config-name.const';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
const config = require(`../../..${configFileName}`);

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly networkService: NetworkService,
    @InjectQueue('mail') private mailQueue: Queue
    ) {}

  sendActivationEmail({
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
    return this.sendMail({
      to,
      cc,
      bcc,
      subject: 'Please verify your account',
      template: 'activation-account',
      context: { activationUrl },
    });
  }

  sendLoginTokenEmail({
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
    return this.sendMail({
      to,
      cc,
      bcc,
      subject: 'You requested a one-click login',
      template: 'login-token',
      context: { activationUrl },
    });
  }
  
  private async sendMail({
    to,
    cc,
    bcc,
    subject,
    template,
    context
  })
  {
    console.log(`added mail to queue: ${to} - ${subject}`)
    if(this.mailQueue.client.status != 'ready')
    {
      console.log('redis is not running. no mail queue.')
      return;
    }
    return await this.mailQueue.add({
      to,
      cc,
      bcc,
      subject,
      template,
      context
    })
  }

  sendActivity({
    to,
    content,
    subject,
    link
  }) {
    return this.sendMail({
      to,
      cc: null,
      bcc: null,
      subject: subject,
      template: 'new-activity',
      context: { content, link },
    });
  }
}
