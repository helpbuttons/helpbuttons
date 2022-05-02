import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from '@src/app/app.module';
import webAppConfig from './app/configs/web-app.config';

// Middleware
import { HttpExceptionFilter } from './shared/middlewares/errors/global-http-exception-filter.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const webAppConfigs = app.get<ConfigType<typeof webAppConfig>>(
    webAppConfig.KEY,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validationError: {
        target: true,
        value: true,
      },
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Helpbuttons backend')
    .setDescription('.')
    .setVersion('1.0')
    .addTag('hb')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(webAppConfigs.swaggerPath, app, document);

  await app.listen(webAppConfigs.port);
}
bootstrap();
