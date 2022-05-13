import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { SignupUserDto } from './user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class SignupExtraRulesInterceptor implements NestInterceptor {
  constructor(private readonly userRepository: UserRepository) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const requestBody: SignupUserDto = request.body;
    const { email } = requestBody;
    const isEmailExists = await this.userRepository.isEmailExists(
      email,
    );

    if (isEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    const { username } = requestBody;
    const isUsernameExists =
      await this.userRepository.isUsernameExists(username);

    if (isUsernameExists) {
      throw new BadRequestException('Username already exists');
    }

    return next.handle();
  }
}
