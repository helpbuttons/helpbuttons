import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { UserService } from '../user/user.service';
import { SignupRequestDto } from './auth.dto';

@Injectable()
export class SignupExtraRulesInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const requestBody: SignupRequestDto = request.body;
    const { email } = requestBody;
    const isEmailExists = await this.userService.isEmailExists(email);

    if (isEmailExists) {
      throw new BadRequestException('email-already-exists');
    }

    return next.handle();
  }
}
