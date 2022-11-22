import { NestFactory } from '@nestjs/core';
import { SetupModule } from '@src/modules/setup/setup.module';

export const setup = async () => {
  var app = await NestFactory.create(SetupModule);
  app.use(function (req, res, next) {
    const fs = require('fs');
    if (fs.existsSync('config.json')) {
      console.log('new configuration file found: config.json')
      app.close();
      var bootstrap = require('./bootstrap').bootstrap;
      bootstrap();
      next();
    } else {
      next();
    }
  });
  var httpServer = await app.listen('3001');
};
