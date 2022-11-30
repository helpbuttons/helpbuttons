import {
  MailerOptions,
  MailerOptionsFactory,
} from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { join } from 'path';
import webAppConfig from '@src/app/configs/web-app.config';

export class MailerModuleConfig implements MailerOptionsFactory {
  constructor(
    @Inject(webAppConfig.KEY)
    private readonly webAppConfigs: ConfigType<typeof webAppConfig>
  ) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    console.log('URL')
    console.log(this.webAppConfigs.smtpUrl)
    return {
      transport: this.webAppConfigs.smtpUrl,
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
