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
    const helpers = { 
      list: function(context, options) {
        var ret = "<div>";
      
        for (var i = 0, j = context.length; i < j; i++) {
          ret = ret + "<div>" + options.fn(context[i]) + "</div>";
        }
      
        return ret + "</div>";
      },
    }
    
    return {
      transport: config.smtpUrl,
      defaults: {
        from: config.from,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(helpers),
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
