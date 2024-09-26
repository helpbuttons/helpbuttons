import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Param,
  UseGuards,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { AllowGuest, OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { HttpStatus } from '@src/shared/types/http-status.enum';
import { UserUpdateDto } from '../user/user.dto';
import { User } from '../user/user.entity';

import { SignupQRRequestDto, SignupRequestDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { QrCodeAuthGuard } from './guards/qrcode-auth.guard';

@ApiTags('User')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowGuest()
  @Post('signupQR')
  async signupQR(@Body() signupQRUserDto: SignupQRRequestDto) {
    return this.authService.signupQR(signupQRUserDto).then((accessToken) => {
      if (typeof accessToken === typeof undefined) {
        throw new HttpException('could not create token', HttpStatus.BAD_GATEWAY)
      }
      return accessToken;
    });
  }

  @AllowGuest()
  @Post('signup')
  async signup(@Body() signupUserDto: SignupRequestDto) {
    return this.authService.signup(signupUserDto).then((accessToken) => {
      if (typeof accessToken === typeof undefined) {
        throw new HttpException('could not create token', HttpStatus.BAD_GATEWAY)
      }
      return accessToken;
    });
  }

  @AllowGuest()
  @Get('requestNewLoginToken/:email')
  requestNewLoginToken(@Param('email') email: string) {
    return this.authService.requestNewLoginToken(email.toLocaleLowerCase());
  }

  @AllowGuest()
  @Get('loginToken/:verificationToken')
  loginToken(@Param('verificationToken') verificationToken: string) {
    return this.authService.loginToken(verificationToken);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @UseGuards(QrCodeAuthGuard)
  @Post('loginqr/:qrcode')
  async loginqr(@Param('qrcode') qrcode: string) {
    return this.authService.validateQrCode(qrcode)
    .then((user) => {
      if(!user)
      {
        throw new UnauthorizedException()
      }
      return this.authService.getAccessToken(user)
    })
  }

  @OnlyRegistered()
  @Post('update')
  async update(@Body() data: UserUpdateDto, @CurrentUser() user: User) {
    return await this.authService.update(data, user);
  }
}
