import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ButtonModule } from '@src/modules/button/button.module';
import { UsersModule } from '@src/modules/users/users.module';

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
    ButtonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
