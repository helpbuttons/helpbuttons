import { ApiTags } from '@nestjs/swagger';
import { OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { User } from '../user/user.entity';
import { DeletemeService } from './deleteme.service';

@ApiTags('User')
@Controller('users')
export class DeletemeController {
  constructor(
    private readonly deletemeService: DeletemeService,
  ) {}

  @OnlyRegistered()
  @Get('deleteme')
  async deleteme(@CurrentUser() user: User){
    return this.deletemeService.deleteme(user)
  }
}