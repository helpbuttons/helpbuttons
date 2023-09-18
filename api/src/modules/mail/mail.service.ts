import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { GlobalVarHelper } from '@src/shared/helpers/global-var.helper';
import { NetworkService } from '../network/network.service';
import { configFileName } from '@src/shared/helpers/config-name.const';
const config = require(`../../..${configFileName}`);

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly networkService: NetworkService,
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
  
  private sendMail({
    to,
    cc,
    bcc,
    subject,
    template,
    context
  })
  {
    if(!GlobalVarHelper.smtpAvailable)
    {
      console.log('Error when smtp not working. mail could not be sent')
      return;
    }
    this.networkService.findDefaultNetwork().then((network) => {
 
      const vars = {...context, network: network, hostName: config.hostName, to: to}
      this.mailerService.sendMail({
        to,
        cc,
        bcc,
        from: config.from,
        subject,
        template,
        context: vars,
      }).then((mail) => {console.log(`>> mail sent to ${to} with template '${template}'`)})
      .catch((error) => {console.log(error); console.trace()})
    }).catch((error) => console.log('getting network error?'))
    
    return 
  }

  sendActivity({
    to,
    cc,
    bcc,
    content,
  }: {
    to: string;
    cc?: string;
    bcc?: string;
    content: string;
  }) {
    return this.sendMail({
      to,
      cc,
      bcc,
      subject: 'A new activity in ',
      template: 'new-activity',
      context: { content },
    });
  }
}
