/** Code from: https://felixastner.com/articles/advanced-typeorm-error-handling-in-nestjs */
/**
 * Global TypeORM/Nest mapping with retry hints for clients.
 */
import {
    ArgumentsHost,
    BadRequestException,
    ConflictException,
    ExceptionFilter,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { QueryFailedError, EntityNotFoundError } from 'typeorm';
  
  @Injectable()
  export class TypeOrmExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        console.log('filter catched it...')
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      const req = ctx.getRequest<Request>();
  
    //   // Entity not found → 404 (from findOneOrFail etc.)
    //   if (exception instanceof EntityNotFoundError) {
    //     return res.status(HttpStatus.NOT_FOUND).json({
    //       statusCode: HttpStatus.NOT_FOUND,
    //       path: req.url,
    //       message: 'Entity not found',
    //     });
    //   }
        console.log(exception)
      // TypeORM query failure with vendor codes
      if (exception instanceof QueryFailedError) {
        const drv: any = (exception as any).driverError || {};
        const code = drv.code || drv.errno || drv.name; // pg | mysql | generic
        const constraint = drv.constraint; // pg
  
        switch (code) {
          // PostgreSQL
          case '23505': // unique_violation
          case 'ER_DUP_ENTRY': // MySQL duplicate
          case 1062: // MySQL numeric
            return res.status(HttpStatus.CONFLICT).json({
              statusCode: HttpStatus.CONFLICT,
              path: req.url,
              message: 'Duplicate resource',
              meta: constraint ? { constraint } : undefined,
            });
  
          case '23503': // foreign_key_violation (pg)
          case 'ER_NO_REFERENCED_ROW_2':
          case 1452:
            return res.status(HttpStatus.BAD_REQUEST).json({
              statusCode: HttpStatus.BAD_REQUEST,
              path: req.url,
              message: 'Related entity missing',
            });
  
          case '23502': // not_null_violation (pg)
            return res.status(HttpStatus.BAD_REQUEST).json({
              statusCode: HttpStatus.BAD_REQUEST,
              path: req.url,
              message: 'A required field is missing',
            });
  
          // Transient / retryable
          case '40001': // serialization_failure (pg)
          case '40P01': // deadlock_detected (pg)
            return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
              statusCode: HttpStatus.SERVICE_UNAVAILABLE,
              path: req.url,
              message: 'Temporary database conflict. Please retry.',
              // Optional: guidance for clients implementing retries
              retryable: true,
            });
        }
  
        // Fallback for anything else
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path: req.url,
          message: 'Database query failed',
        });
      }
  
      // Unknown error → let Nest default handler deal with it or mask
      throw new InternalServerErrorException();
    }
  }