import { Controller, Get, Param, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AllowGuest, OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { Role } from '@src/shared/types/roles';
import { Auth } from '@src/shared/decorator/auth.decorator';
// import { AllowIfNetworkIsPublic } from '@src/shared/decorator/privacy.decorator';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OnlyRegistered()
  @Get('whoAmI')
  whoAmI(@Request() req) {
    return req.user;
  }

  @AllowGuest()
  // @AllowIfNetworkIsPublic()
  @Get('/find/:username')
  async find(@Param('username') username: string) {
    return await this.userService.findByUsername(username)
    .then((user) => {
      return user
    })
  }
}
