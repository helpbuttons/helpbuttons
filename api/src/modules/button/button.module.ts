import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonService } from './button.service.js';
import { ButtonController } from './button.controller.js';
import { Button } from './button.entity.js';
import { TagModule } from '../tag/tag.module.js';
import { NetworkModule } from '../network/network.module.js';
import { StorageModule } from '../storage/storage.module.js';
import { PostModule } from '../post/post.module.js';
import { ButtonCron } from './button.cron.js';
import { MailModule } from '../mail/mail.module.js';
import { UserModule } from '../user/user.module.js';
import { ButtonCommand } from './button.command.js';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
    TypeOrmModule.forFeature([Button]),
    TagModule,
    NetworkModule,
    StorageModule,
    forwardRef(() => PostModule),
    MailModule,
    UserModule,
    CacheModule.register()
  ],
  controllers: [
    ButtonController
  ],
  providers: [
    ButtonService,
    ButtonCron,
    ButtonCommand
  ],
  exports: [
    ButtonService
  ]
})
export class ButtonModule {}
