import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('whoAmI')
  whoAmI() {
    return this.userService.whoAmI();
  }
}
