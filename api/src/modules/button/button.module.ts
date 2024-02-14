import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonService } from './button.service';
import { ButtonController } from './button.controller';
import { Button } from './button.entity';
import { TagModule } from '../tag/tag.module';
import { NetworkModule } from '../network/network.module';
import { StorageModule } from '../storage/storage.module';
import { PostModule } from '../post/post.module';
import { ButtonCron } from './button.cron';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { ButtonCommand } from './button.command';


@Module({
  imports: [
    TypeOrmModule.forFeature([Button]),
    TagModule,
    NetworkModule,
    StorageModule,
    forwardRef(() => PostModule),
    MailModule,
    UserModule
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
