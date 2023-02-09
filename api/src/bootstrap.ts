import 'reflect-metadata';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

import { AppModule } from '@src/app/app.module';
import webAppConfig from './app/configs/web-app.config';
import * as bodyParser from 'body-parser';

// Middleware
import { HttpExceptionFilter } from './shared/middlewares/errors/global-http-exception-filter.middleware';
import {
  ValidationException,
  ValidationFilter,
} from './shared/middlewares/errors/validation-filter.middleware';

export const bootstrap = async () => {
    /**
     * README: Calling initializeTransactionalContext and or patchTypeORMRepositoryWithBaseRepository must happen BEFORE any application context is initialized!
     */
    initializeTransactionalContext();
  
    // check if .env exists... else give an api call anywayz
    var path = require('path');
  
    const app = await NestFactory.create(AppModule);
  
    const webAppConfigs = app.get<ConfigType<typeof webAppConfig>>(
      webAppConfig.KEY,
    );
  
    app.enableCors({ origin: webAppConfigs.allowedCors });
  
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalFilters(new HttpExceptionFilter());

    // validation filters
    app.useGlobalFilters(new ValidationFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => {
          const errMsg = {};
          errors.forEach((err) => {
            errMsg[err.property] = [...Object.values(err.constraints)];
          });
          return new ValidationException(errMsg);
        },
      }),
    );
  
    const config = new DocumentBuilder()
      .setTitle('Helpbuttons backend')
      .setDescription('.')
      .setVersion('1.0')
      .addTag('hb')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
    await app.listen('3001');
  };
