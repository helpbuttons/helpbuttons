import { ApiTags } from '@nestjs/swagger';
import { OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { User } from '../user/user.entity';
import { DeletemeService } from './deleteme.service';
import { Role } from '@src/shared/types/roles';

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