import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service.js';
import { MailerModuleConfig } from './mailer-module.config.js';
import { NetworkModule } from '../network/network.module.js';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from './mail.processor.js';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: MailerModuleConfig,
    }),
    forwardRef(() => NetworkModule),
    BullModule.registerQueue({
      name: 'mail',
    })
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService],
})
export class MailModule {}
