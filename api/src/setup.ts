import { NestFactory } from '@nestjs/core';
import { SetupModule } from '@src/modules/setup/setup.module';
import { HttpExceptionFilter } from './shared/middlewares/errors/global-http-exception-filter.middleware';

export const setup = async () => {
  var app = await NestFactory.create(SetupModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  return app;
};