import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { NetworkService } from '../network/network.service';
import { MailerService } from '@nestjs-modules/mailer';
import { configFileName } from '@src/shared/helpers/config-name.const';
import { GlobalVarHelper } from '@src/shared/helpers/global-var.helper';
const config = require(`../../..${configFileName}`);
export interface MailJob {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    template: string;
    context: any;
  }
@Processor('mail')
export class MailConsumer {
  constructor(
    private readonly networkService: NetworkService,
    private readonly mailerService: MailerService,
  ) {}

  @Process()
  async sendMail(job: Job<MailJob>) {
    // const {to, cc, bcc, subject, template, context} = job.data;
    // console.log('sending mail.. queue...')
    console.log(job.data)
    // console.log(job)
    // console.log(to, cc, bcc, subject, template, context )
    // return true;
    if (!GlobalVarHelper.smtpAvailable) {
      console.log(
        'Error when smtp not working. mail could not be sent',
      );
      return Promise.reject('Error when smtp not working. mail could not be sent');
    }
    const {to, cc, bcc, subject, template, context} = job.data;
    return this.networkService
      .findDefaultNetwork()
      .then((network) => {
        const vars = {
          ...context,
          network: network,
          hostName: config.hostName,
          to: to,
        };
        return this.mailerService
          .sendMail({
            to,
            cc,
            bcc,
            from: config.from,
            subject: `${subject} in ${network.name}`,
            template,
            context: vars,
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

  @OnQueueFailed()
  handler(job: Job<MailJob>, error: Error)
  {
    console.log('Error processing job:')
    console.log(JSON.stringify(job.data))
    console.log(error)
  }
}
