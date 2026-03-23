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
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
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
import { notifyUser } from '@src/app/app.event';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { imageFileFilter } from '../storage/storage.utils';
import { FileFieldsUploadInterceptor } from '@src/shared/decorators/file-upload.decorator';

@ApiTags('User')
@Controller('users')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private eventEmitter: EventEmitter2
  ) {}

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
  async signup(
    @Body() signupUserDto: SignupRequestDto,
    @UploadedFile() avatar : Express.Multer.File,
  ) {
    return this.authService.signup(signupUserDto, avatar).then((newUser) => {
      if (typeof newUser === typeof undefined) {
        throw new HttpException('could not create token', HttpStatus.BAD_GATEWAY)
      }
      // this.notifyAdmins()
      notifyUser(this.eventEmitter,ActivityEventName.NotifyAdmins,{user: newUser })  

      return newUser;
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

  @AllowGuest()
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
  @UseInterceptors(
    FileFieldsUploadInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
      ],
      imageFileFilter
    )
  )
  async update(
    @Body() body: any,
    @CurrentUser() user: User,
    @UploadedFiles() files: {avatar?: Express.Multer.File[]},
  ) {
    const data : UserUpdateDto = JSON.parse(body.data);
    const avatar = files?.avatar?.length > 0 ? files.avatar[0] : null;
    return await this.authService.update(user, data, avatar);
  }
}
