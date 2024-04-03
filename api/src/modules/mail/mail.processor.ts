import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { NetworkService } from '../network/network.service';
import { MailService } from './mail.service';
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
    private readonly mailService: MailService,
  ) {}

  @Process()
  async sendMail(job: Job<MailJob>) {
    return this.mailService.sendMailDirectly(job.data)
  }

  @OnQueueFailed()
  handler(job: Job<MailJob>, error: Error)
  {
    console.log('Error processing job:')
    console.log(JSON.stringify(job.data))
    console.log(error)
  }
}
