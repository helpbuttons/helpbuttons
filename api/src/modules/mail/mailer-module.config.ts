import {
  MailerOptions,
  MailerOptionsFactory,
} from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { configFileName } from '@src/shared/helpers/config-name.const';

const config = require(`../../..${configFileName}`);
export class MailerModuleConfig implements MailerOptionsFactory {
  constructor(
  ) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: config.smtpUrl,
      defaults: {
        from: config.from,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: __dirname + '/templates/partials',
          options: {
            strict: true,
          },
        },
      },
    }
  }

}
