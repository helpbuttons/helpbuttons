import {
  MailerOptions,
  MailerOptionsFactory,
} from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js';
import configs from '@src/config/configuration.js';

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
      each: function(context, options) {
        var ret = "";
        for (var i = 0, j = context.length; i < j; i++) {
          ret = ret + options.fn(context[i]);
        }
        return ret;
      }
    }
    
    return {
      transport: {
        host: configs().smtpHost,
        port: configs().smtpPort,
        auth: {
          user: configs().smtpUser,
          pass: configs().smtpPass
        }
      },
      defaults: {
        from: configs().from,
      },
      template: {
        dir: `${process.platform === 'win32' ? '' : '/'}${/file:\/{2,3}(.+)\/[^/]/.exec(import.meta.url)![1]}` + '/templates',
        adapter: new HandlebarsAdapter(helpers),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: `${process.platform === 'win32' ? '' : '/'}${/file:\/{2,3}(.+)\/[^/]/.exec(import.meta.url)![1]}` + '/templates/partials',
          options: {
            strict: true,
          },
        },
      },
    }
  }

}
