import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@src/modules/auth/auth.module';
import { ButtonModule } from '@src/modules/button/button.module';
import { FeedButtonModule } from '@src/modules/feed-button/feed-button.module';
import { MailModule } from '@src/modules/mail/mail.module';
import { NetworkModule } from '@src/modules/network/network.module';
import { SetupModule } from '@src/modules/setup/setup.module';
import { StorageModule } from '@src/modules/storage/storage.module';
import { TagModule } from '@src/modules/tag/tag.module';
import { TemplateButtonModule } from '@src/modules/template-button/template-button.module';
import { UserCredentialModule } from '@src/modules/user-credential/user-credential.module';
import { UserModule } from '@src/modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmModuleOptions } from './configs/orm.config';
import webAppConfig from './configs/web-app.config';
import { validate } from './validators/env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      encoding: 'utf-8',
      envFilePath: ['.env', '.postgres.env'],
      isGlobal: true,
      load: [webAppConfig],
      validate: validate,
    }),
    MailModule,
    // FIXME: READ this confs using ConfigService
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    MulterModule.register({
      dest: './uploads/',
    }),
    ButtonModule,
    TagModule,
    NetworkModule,
    TemplateButtonModule,
    UserModule,
    AuthModule,
    UserCredentialModule,
    StorageModule,
    FeedButtonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
