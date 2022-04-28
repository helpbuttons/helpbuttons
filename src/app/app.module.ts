import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonModule } from '@src/modules/button/button.module';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOSTNAME,
      port: parseInt(process.env.POSTGRESQL_EXPOSED_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      "entities": ["dist/modules/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    ButtonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
