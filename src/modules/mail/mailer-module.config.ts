import {
  MailerOptions,
  MailerOptionsFactory,
} from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import mailConfig from './mail.config';
import { join } from 'path';

export class MailerModuleConfig implements MailerOptionsFactory {
  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfigs: ConfigType<typeof mailConfig>,
  ) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: this.mailConfigs.smtpUrl,
      defaults: {
        from: '"No Replay|help button" <no-replay@https://helpbuttons.org>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
