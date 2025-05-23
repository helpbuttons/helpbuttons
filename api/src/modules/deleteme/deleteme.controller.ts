import { ApiTags } from '@nestjs/swagger';
import { OnlyRegistered } from '@src/shared/decorator/roles.decorator.js';
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { CurrentUser } from '@src/shared/decorator/current-user.js';
import { User } from '../user/user.entity.js';
import { DeletemeService } from './deleteme.service.js';
import { Role } from '@src/shared/types/roles.js';

@ApiTags('User')
@Controller('users')
export class DeletemeController {
  constructor(
    private readonly deletemeService: DeletemeService,
  ) {}

  @OnlyRegistered()
  @Get('deleteme')
  async deleteme(@CurrentUser() user: User){
    if(user.role == Role.admin)
    {
      throw new HttpException(
        { message: 'Administrator account not allowed to be deleted' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.deletemeService.deleteme(user)
  }
}