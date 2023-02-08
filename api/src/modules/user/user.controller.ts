import { Controller, Get, Request } from '@nestjs/common';

import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@src/shared/decorator/auth.decorator';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('whoAmI')
  whoAmI(@Request() req) {
    return req.user;
  }
}
