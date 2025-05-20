import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AllowGuest, OnlyAdmin, OnlyRegistered } from '@src/shared/decorator/roles.decorator';
import { Role } from '@src/shared/types/roles';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { User, UserExtended } from './user.entity';
import { InviteService } from '../invite/invite.service';
import { InviteCreateDto } from '../invite/invite.dto';
import { plainToClass } from 'class-transformer';
import { nomailString } from '../auth/auth.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly inviteService: InviteService,
  ) {}

  @OnlyRegistered()
  @Get('whoAmI')
  whoAmI(@Request() req) {
    const user = req.user
    let userClean = user;
    if(user.email.endsWith(nomailString))
    {
      userClean = {...user, email: ''}
    }
    return {...userClean, t: 'k'}
  }

  @AllowGuest()
  @Get('/find/:username')
  async find(@Param('username') username: string) {
    const user = await this.userService
      .findByUsername(username, true);
     return plainToClass(UserExtended, user, { excludeExtraneousValues: true })
  }

  @OnlyAdmin()
  @Get('findExtra/:userId')
  async findExtra(@Param('userId') userId: string){
    return await this.userService
    .findById(userId);
  }

  @OnlyRegistered()
  @Get('invites')
  async invites(@CurrentUser() user: User) {
    return await this.inviteService.find(user);
  }

  @OnlyRegistered()
  @Post('createInvite')
  async createInvite(@Body() newInvitation: InviteCreateDto, @CurrentUser() user: User) {
    return await this.inviteService.create(newInvitation, user);
  }

  @OnlyAdmin()
  @Post('/updateRole/:userId/:role')
  async updateRole(@Param('userId') userId: string, @Param('role') role: Role) {
    return await this.userService.updateRole(userId, role);
  }

  @OnlyAdmin()
  @Get('moderationList/:page')
  moderationList(@Param('page') page: number, @CurrentUser() user: User)
  {
    return this.userService.moderationList(user, page)
  }

  @AllowGuest()
  @Post('/unsubscribe/:email')
  async unsubscribe(@Param('email') email: string)
  {
    return await this.userService.unsubscribe(email);
  }

  @OnlyRegistered()
  @Post('followTag/:tag')
  follow(@Param('tag') tag: string, @CurrentUser() user: User) {
    return this.userService.addTag(tag, user);
  }

  @OnlyRegistered()
  @Post('followTags/:tags')
  followTags(@Param('tags') tags: string, @CurrentUser() user: User) {
    return this.userService.addTags(tags, user);
  }

  @AllowGuest()
  @Get('/getPhone/:userId')
  async getPhone(@Param('userId') userId: string) {
    const phone = await this.userService.getPhone(userId)
    return JSON.stringify(phone)
  }

  @OnlyAdmin()
  @Get('endorse/:userId')
  endorse(@Param('userId') userId: string) {
    return this.userService.endorse(userId);
  }


  @OnlyAdmin()
  @Get('revokeEndorse/:userId')
  untrust(@Param('userId') userId: string) {
    return this.userService.revokeEndorse(userId);
  }
}
