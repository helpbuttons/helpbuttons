import 'reflect-metadata';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

import { AppModule } from '@src/app/app.module';
import * as bodyParser from 'body-parser';

// Middleware
import { HttpExceptionFilter } from './shared/middlewares/errors/global-http-exception-filter.middleware';
import {
  ValidationException,
  ValidationFilter,
} from './shared/middlewares/errors/validation-filter.middleware';
import configs from './config/configuration';
import { GlobalVarHelper } from './shared/helpers/global-var.helper';
import { checkDatabase } from './shared/helpers/config.helper';

export const bootstrap = async () => {
  /**
   * README: Calling initializeTransactionalContext and or patchTypeORMRepositoryWithBaseRepository must happen BEFORE any application context is initialized!
   */
  initializeTransactionalContext();

  // check if .env exists... else give an api call anywayz
  var path = require('path');

  console.log('Using configurations: ');
  console.log(configs());

  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: configs().hostName });

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

  const nodemailer = require('nodemailer');

  const smtpConfig = {
    host: configs().smtpHost,
    port: configs().smtpPort,
    auth: {
      user: configs().smtpUser,
      pass: configs().smtpPass,
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  if (!configs().smtpHost) {
    await transporter
      .verify()
      .then(() => {
        console.log(`SMTP is OK!`);
        GlobalVarHelper.smtpAvailable = true;
      })
      .catch((error) => {
        console.log(
          `Error connecting to smtp: ${JSON.stringify(error)}`,
        );
      });
  } else {
    console.log('no smtp server set. passing...');
  }

  await checkDatabase(configs())
    .then(() => console.log('Database connection is ok!'))
    .catch((err) => {
      console.log('error connecting to database');
      console.log(err);
      throw Error("Can't connect to database");
    });

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

bootstrap();
