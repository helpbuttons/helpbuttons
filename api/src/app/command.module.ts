import {
    MiddlewareConsumer,
    Module,
    NestModule,
  } from '@nestjs/common';
  import { ConfigModule } from '@nestjs/config';
  import { MulterModule } from '@nestjs/platform-express';
  import { TypeOrmModule } from '@nestjs/typeorm';
  
  import { AuthModule } from '@src/modules/auth/auth.module.js';
  import { ButtonModule } from '@src/modules/button/button.module.js';
  import { MailModule } from '@src/modules/mail/mail.module.js';
  import { NetworkModule } from '@src/modules/network/network.module.js';
  // import { PostModule } from '@src/modules/post/post.module';
  import { StorageModule } from '@src/modules/storage/storage.module.js';
  import { TagModule } from '@src/modules/tag/tag.module.js';
  import { TemplateButtonModule } from '@src/modules/template-button/template-button.module.js';
  import { UserCredentialModule } from '@src/modules/user-credential/user-credential.module.js';
  import { UserModule } from '@src/modules/user/user.module.js';
  import { AppLogger } from '@src/shared/middlewares/app-logger.middleware.js';
  import { AppController } from './app.controller.js';
  import { AppService } from './app.service.js';
  import { dataSourceOptions } from './configs/orm.config.js';
  import webAppConfig from './configs/web-app.config.js';
  import { validate } from './validators/env.validator.js';
  import { EventEmitterModule } from '@nestjs/event-emitter';
  import { PostModule } from '@src/modules/post/post.module.js';
  import { ActivityModule } from '@src/modules/activity/activity.module.js';
  import { InviteModule } from '@src/modules/invite/invite.module.js';
  import { GeoModule } from '@src/modules/geo/geo.module.js';
  import { BullModule } from '@nestjs/bull';
  // import { CommandModule } from 'nestjs-command';
  import { ButtonCron } from '@src/modules/button/button.cron.js';
  import { SetupModule } from '@src/modules/setup/setup.module.js';
  @Module({
    imports: [
      ConfigModule.forRoot({
        cache: true,
        envFilePath: ['.env', '.postgres.env'],
        isGlobal: true,
        load: [webAppConfig],
        validate: validate,
      }),
      // CommandModule,
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
      InviteModule,
      GeoModule,
      BullModule.forRoot({
        redis: {
          host: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        },
        defaultJobOptions: {
          attempts: 3,
          timeout: 1500,
          backoff: 1000*10,
        }
      }),
      SetupModule
    ],
    controllers: [AppController],
    providers: [
      AppService,
      ButtonCron
    ],
  })
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
      consumer.apply(AppLogger).forRoutes('*');
    }
  }
  
  