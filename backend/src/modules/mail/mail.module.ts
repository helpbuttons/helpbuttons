import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';
import mailConfig from './mail.config';
import { MailerModuleConfig } from './mailer-module.config';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailConfig)],
      inject: [ConfigService],
      useClass: MailerModuleConfig,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
