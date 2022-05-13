import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { LoginDto, SignupUserDto } from './user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignupExtraRulesInterceptor } from './signup-extra-rules.interceptor';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(SignupExtraRulesInterceptor)
  async signup(@Body() signupUserDto: SignupUserDto) {
    return await this.userService.signup(signupUserDto);
  }

  @Get('activate/:verificationToken')
  activate(@Param('verificationToken') verificationToken: string) {
    return this.userService.activate(verificationToken);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get('whoAmI')
  whoAmI() {
    return this.userService.whoAmI();
  }
}
