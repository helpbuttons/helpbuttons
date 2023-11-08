export interface MailJob {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    template: string;
    context: any;
  }