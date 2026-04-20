export interface MailJob {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    template: string;
    context: any;
  }

export interface MailActivity {
  subject?: string,
  content: string,
  link: string,
  linkCaption: string;
}


export interface MailButtonActivity {
  subject?: string,
  content: string,
  link: string,
  linkCaption: string;
  title: string;
  address: string;
  type: string;
}