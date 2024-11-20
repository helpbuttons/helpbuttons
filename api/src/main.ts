import 'reflect-metadata';
import { ClassSerializerInterceptor, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
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
import { CallHandler, ExecutionContext, Injectable, PlainLiteralObject } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Role } from './shared/types/roles';
import { version } from './version.json'

@Injectable()
export class RolesSerializerInterceptor extends ClassSerializerInterceptor {

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    const userRole  = context.switchToHttp().getRequest().user?.role ?? Role.guest;
    let requiredRoles = this.reflector.getAllAndOverride(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
    };
    if(userRole == Role.admin)
    {
      return next
      .handle()
    }
    return next
      .handle()
      .pipe(
        map((res: PlainLiteralObject | PlainLiteralObject[]) =>
          this.serialize(res, options)
        )
      );
  }
}
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
  app.enableCors({origin: configs().WEB_URL})
  
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalInterceptors(new RolesSerializerInterceptor(
    app.get(Reflector))
  );
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
  
  const title = 'Helpbuttons API documentation'
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription('You chan check more about helpbuttons in our website helpbuttons.org')
    .addTag('hb')
    .addBearerAuth()
    .addServer(`${configs().WEB_URL}/api`)
    .setVersion(version)
    .setContact('Helpbuttons Team', 'https://helpbuttons.org', 'help@helpbuttons.org')
    .setLicense('CC BY-SA-4.0', 'https://creativecommons.org/licenses/by-sa/4.0/')
    .build();

  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
  SwaggerModule.setup('/', app, document, { customSiteTitle: title});
  await app.listen('3001');
};

bootstrap();
