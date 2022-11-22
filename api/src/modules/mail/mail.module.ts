import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';
import { MailerModuleConfig } from './mailer-module.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: MailerModuleConfig,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
