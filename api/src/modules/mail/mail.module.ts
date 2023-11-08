import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';
import { MailerModuleConfig } from './mailer-module.config';
import { NetworkModule } from '../network/network.module';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from './mail.processor';
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
