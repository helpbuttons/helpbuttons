import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@src/modules/auth/auth.module';
import { ButtonModule } from '@src/modules/button/button.module';
import { MailModule } from '@src/modules/mail/mail.module';
import { NetworkModule } from '@src/modules/network/network.module';
import { TagModule } from '@src/modules/tag/tag.module';
import { TemplateButtonModule } from '@src/modules/template-button/template-button.module';
import { UserCredentialModule } from '@src/modules/user-credential/user-credential.module';
import { UserModule } from '@src/modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOSTNAME,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/modules/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ButtonModule,
    TagModule,
    NetworkModule,
    TemplateButtonModule,
    UserModule,
    AuthModule,
    UserCredentialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
