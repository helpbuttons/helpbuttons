import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';
import { MailerModuleConfig } from './mailer-module.config';
import { NetworkModule } from '../network/network.module';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: MailerModuleConfig,
    }),
    forwardRef(() => NetworkModule)
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
