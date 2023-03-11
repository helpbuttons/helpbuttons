import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLogger implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      let contentLength = response.get('content-length');
      contentLength = contentLength ? contentLength : '0'; 
      this.logger.log(
        `${method} ${request.url} ${statusCode} ${contentLength}B - ${userAgent} ${ip}`
      );
    });

    next();
  }
}