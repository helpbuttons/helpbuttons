import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NetworkService } from '../network/network.service.js';
import configs from '@src/config/configuration.js';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import translate from '@src/shared/helpers/i18n.helper.js';
import { getUrl } from '@src/shared/helpers/mail.helper.js';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly networkService: NetworkService,
    @InjectQueue('mail') private mailQueue: Queue
    ) {}

  sendActivationEmail({
    to,
    locale,
    activationUrl,
  }: {
    to: string;
    locale: string;
    activationUrl: string;
  }) {
    return this.networkService.findDefaultNetwork().then((network) => {
      return this.sendWithLink({
        to,
        content: translate(
          locale,
          'email.activateContent',
          [network.name]
        ),
        subject: translate(
          locale,
          'email.activateSubject'
        ),
        link: getUrl(locale, activationUrl),
        linkCaption: translate(
          locale,
          'email.activateLinkCaption'
        ),
      });
    });
  }

  sendLoginTokenEmail({
    to,
    activationUrl,
    locale,
  }: {
    to: string;
    activationUrl: string;
    locale: string
  }) {
    return this.networkService.findDefaultNetwork().then((network) => {
      return this.sendWithLink({
        to,
        content: translate(
          locale,
          'email.loginTokenContent',
          [network.name]
        ),
        subject: translate(
          locale,
          'email.loginTokenSubject'
        ),
        link: getUrl(locale, activationUrl),
        linkCaption: translate(
          locale,
          'email.loginTokenLinkCaption'
        ),
      });
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
    this.sendMailDirectly( {to, cc, bcc, subject, template, context})
    return;
    // console.log(`added mail to queue: ${to} - ${subject}`)
    // if(this.mailQueue.client.status != 'ready')
    // {
    //   console.log('redis is not running. no mail queue. sending directly.')
     
    // }
    // return await this.mailQueue.add({
    //   to,
    //   cc,
    //   bcc,
    //   subject,
    //   template,
    //   context
    // })
  }

  sendMailDirectly( {to, cc, bcc, subject, template, context})
  {
    this.networkService
      .findDefaultNetwork()
      .then((network) => {
        let from  = configs().from
        try {
          from = network.name + configs().from.slice(configs().from.indexOf('<'))
        }catch(err)
        {
          console.log('could not add network name to from')
        }

        if(!configs().smtpHost)
        {
          console.log('smtp host not set. not sending')
          return;
        }
        let logo = 'no logo'
        try{
          logo = configs().WEB_URL + '/api' + network.logo
        }catch(err)
        {
          console.log(err)
        }
        return this.mailerService
          .sendMail({
            to,
            cc,
            bcc,
            from: from,
            subject: subject,
            template,
            context: {...context, hostName: configs().hostName, to: to, logo},
          })
          .then((mail) => {
            console.log(
              `>> mail sent to ${to} with template '${template}'`,
            );
          })
          .catch((error) => {
            console.log(error);
            console.trace();
          });
      })
      .catch((error) => console.log('getting network error?'));
  }

  sendWithLink({
    to,
    content,
    subject,
    link,
    linkCaption
  }) {
    return this.sendMail({
      to: to,
      cc: null,
      bcc: null,
      subject: subject,
      template: 'mail',
      context: {
        subject: subject,
        content: content,
        link: link, 
        linkCaption: linkCaption,
        to: to,
      },
    });
  }

  sendDailyOutbox({
    activities,
    to,
    subject
  })
  {
    return this.sendMail({
      to: to,
      cc: null,
      bcc: null,
      subject: subject,
      template: 'daily-outbox',
      context: {
          activities,
          subject
      },
    });
  }
}
