import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Request,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoginRequestDto, SignupRequestDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignupExtraRulesInterceptor } from './signup-extra-rules.interceptor';

@ApiTags('User')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(SignupExtraRulesInterceptor)
  async signup(@Body() signupUserDto: SignupRequestDto) {
    return this.authService.signup(signupUserDto).then((accessToken) => {
      console.log(accessToken)
      if (typeof accessToken === typeof undefined) {
        throw new HttpException('could not create token', HttpStatus.BAD_GATEWAY)
      }
      return accessToken;
    });
  }

  @Get('activate/:verificationToken')
  activate(@Param('verificationToken') verificationToken: string) {
    return this.authService.activate(verificationToken);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
