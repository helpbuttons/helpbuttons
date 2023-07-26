import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { configFileName } from '@src/shared/helpers/config-name.const';
import { GlobalVarHelper } from '@src/shared/helpers/global-var.helper';
// import { template } from './mail.module';
const config = require(`../../..${configFileName}`);

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

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
  
  private sendMail({
    to,
    cc,
    bcc,
    subject,
    template,
    context: { activationUrl },
  })
  {
    if(!GlobalVarHelper.smtpAvailable)
    {
      console.log('Error when smtp not working. mail could not be sent')
      return;
    }
    this.mailerService.sendMail({
      to,
      cc,
      bcc,
      from: config.from,
      subject,
      template,
      context: { activationUrl },
    }).then((mail) => {console.log(`>> mail sent to ${to} with template '${template}'`)})
    .catch((error) => {console.log(error); console.trace()})
    return 
  }
}
