import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLogger implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const { ip, method } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = process.hrtime();

    response.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const durationInMs = seconds * 1000 + nanoseconds / 1e6;
      console.log(
        `${request.method} ${
          request.originalUrl
        } took ${durationInMs.toFixed(3)} ms`,
      );
    });

    response.on('close', () => {
      const { statusCode } = response;
      let contentLength = response.get('content-length');
      contentLength = contentLength ? contentLength : '0';
      const message = `${method} ${request.url} ${statusCode} ${contentLength}B - ${userAgent} ${ip}`;
      if (statusCode < 200 || statusCode > 299) {
        this.logger.log(`\x1b[31m${message}\x1b[0m`);
      } else {
        this.logger.log(message);
      }
    });
    next();
  }
}
