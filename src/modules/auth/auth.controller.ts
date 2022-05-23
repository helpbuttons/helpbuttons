import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Request,
  Param,
  UseGuards,
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
    return await this.authService.signup(signupUserDto);
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
