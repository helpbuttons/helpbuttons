import { NestFactory } from '@nestjs/core';
import { SetupModule } from '@src/modules/setup/setup.module';
import { configFullPath } from './shared/helpers/config.helper';
import { HttpExceptionFilter } from './shared/middlewares/errors/global-http-exception-filter.middleware';

export const setup = async () => {
  var app = await NestFactory.create(SetupModule);
  app.use(function (req, res, next) {
    const fs = require('fs');
    if (fs.existsSync(configFullPath)) {
      console.log(`new configuration file found: ${configFullPath}`)
      app.close();
      var bootstrap = require('./bootstrap').bootstrap;
      bootstrap();
      next();
    } else {
      next();
    }
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen('3001');
};
