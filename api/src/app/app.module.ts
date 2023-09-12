import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@src/modules/auth/auth.module';
import { ButtonModule } from '@src/modules/button/button.module';
import { MailModule } from '@src/modules/mail/mail.module';
import { NetworkModule } from '@src/modules/network/network.module';
// import { PostModule } from '@src/modules/post/post.module';
import { StorageModule } from '@src/modules/storage/storage.module';
import { TagModule } from '@src/modules/tag/tag.module';
import { TemplateButtonModule } from '@src/modules/template-button/template-button.module';
import { UserCredentialModule } from '@src/modules/user-credential/user-credential.module';
import { UserModule } from '@src/modules/user/user.module';
import { AppLogger } from '@src/shared/middlewares/app-logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './configs/orm.config';
import webAppConfig from './configs/web-app.config';
import { validate } from './validators/env.validator';
import {EventEmitterModule } from '@nestjs/event-emitter' 
import { PostModule } from '@src/modules/post/post.module';
import { ActivityModule } from '@src/modules/activity/activity.module';
import { GeoModule } from '@src/modules/geo/geo.module';
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
    TypeOrmModule.forRoot(dataSourceOptions),
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
    EventEmitterModule.forRoot(),
    PostModule,
    ActivityModule,
    GeoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLogger).forRoutes('*');
  }
}
