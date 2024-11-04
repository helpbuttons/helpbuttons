import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseArrayPipe,
  Header,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ApiTags } from '@nestjs/swagger';

import { CreateButtonDto, UpdateButtonDto } from './button.dto';
import { ButtonService } from './button.service';
// import { FilterButtonsOrmDto } from '../dto/requests/filter-buttons-orm.dto';
import {
  editFileName,
  imageFileFilter,
} from '../storage/storage.utils';
import { CurrentUser } from '@src/shared/decorator/current-user';
import { User } from '../user/user.entity';
import {
  AllowGuest,
  OnlyAdmin,
  OnlyRegistered,
} from '@src/shared/decorator/roles.decorator';
import { AllowIfNetworkIsPublic } from '@src/shared/decorator/privacy.decorator';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { EventEmitter2 } from '@nestjs/event-emitter'
import { notifyUser } from '@src/app/app.event';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { PostService } from '../post/post.service';
import { plainToInstance } from 'class-transformer';
import { Button } from './button.entity';
import { UserService } from '../user/user.service';

@ApiTags('buttons')
@Controller('buttons')
export class ButtonController {
  constructor(
    private readonly buttonService: ButtonService,
    private readonly postService: PostService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2
    ) {}

  @OnlyRegistered()
  @Post('new')
  @UseInterceptors(
    FilesInterceptor('images[]', 4, {
      storage: diskStorage({
        destination: process.env.UPLOADS_PATH,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  create(
    @Query('networkId') networkId: string,
    @UploadedFiles() images,
    @Body() createDto: CreateButtonDto,
    @CurrentUser() user: User,
  ) {
    return this.buttonService.create(
      createDto,
      networkId,
      images,
      user,
    ).then((button) => {
        if(button.awaitingApproval){
          // notify admins that button is for approval
        }else{
          notifyUser(this.eventEmitter,ActivityEventName.NewButton,{button})  
        }
        return button;
    });
  }

  @AllowGuest()
  @AllowIfNetworkIsPublic()
  @Post('/findh3/:resolution')
  async findh3(
    @Param('resolution') resolution: number,
    @Body('hexagons', new ParseArrayPipe({ items: String, separator: ',' }))
    hexagons: string[],
  ) {
    const btns = await this.buttonService.findh3(resolution, hexagons);
    return btns.map((btn) => {
      return plainToInstance(Button, btn, { excludeExtraneousValues: true })
    })
  }

  @AllowGuest()
  @AllowIfNetworkIsPublic()
  @Get('findById/:buttonId')
  async findOne(@Param('buttonId') buttonId: string) {
    return this.buttonService.findById(buttonId, true);
  }

  @OnlyRegistered()
  @Post('update/:buttonId')
  async update(
    @Param('buttonId') buttonId: string,
    @Body() updateDto: UpdateButtonDto,
    @CurrentUser() user: User,
  ) {
    return await this.buttonService
      .isOwner(user, buttonId, true)
      .then((isOwner) => {
        if (!isOwner) {
          throw new CustomHttpException(ErrorName.NoOwnerShip);
        }
        return this.buttonService.update(buttonId, updateDto, user);
      });
  }

  // only allow owner of buttonId or Admin
  @OnlyRegistered()
  @Delete('delete/:buttonId')
  async delete(
    @Param('buttonId') buttonId: string,
    @CurrentUser() user: User,
  ) {
    return await this.buttonService
      .isOwner(user, buttonId)
      .then((isOwner) => {
        if (!isOwner) {
          throw new CustomHttpException(ErrorName.NoOwnerShip);
        }
        return this.buttonService.delete(buttonId).then((button) => {
          notifyUser(this.eventEmitter,ActivityEventName.DeleteButton,{button, user})
          return true;
        });
      });
  }

  @OnlyRegistered()
  @Get('/follow/:buttonId')
  async follow(
    @Param('buttonId') buttonId: string,
    @CurrentUser() user: User,
  )
  {
    return this.buttonService.follow(buttonId, user.id).then((button) => {
      notifyUser(this.eventEmitter,ActivityEventName.NewFollowingButton,{button, user})
      // notify owner of button
      notifyUser(this.eventEmitter, ActivityEventName.NewFollowedButton, {button, user})
    })
  }

  @OnlyRegistered()
  @Get('/unfollow/:buttonId')
  async unfollow(
    @Param('buttonId') buttonId: string,
    @CurrentUser() user: User,
  )
  {
    return this.buttonService.unfollow(buttonId, user.id);
  }

  @AllowGuest()
  @Get('findByOwner/:userId')
  async findByOwner(@Param('userId') userId: string) {
    return await this.userService.findById(userId)
    .then((user) => {
      if(user.showButtons)
      {
        return this.buttonService.findByOwner(userId);
      }else{
        return []
      }
    })
  }

  @AllowGuest()
  @Get('getphone/:buttonId')
  async getPhone(@Param('buttonId') buttonId: string)
  {
    return this.buttonService.getPhone(buttonId)
  }

  @OnlyRegistered()
  @Get('/renew/:buttonId')
  async renew(@Param('buttonId') buttonId: string, @CurrentUser() user: User)
  {
    return await this.buttonService
    .isOwner(user, buttonId, true)
    .then((isOwner) => {
      if (!isOwner) {
        throw new CustomHttpException(ErrorName.NoOwnerShip);
      }
      // return ;
      return this.buttonService.findById(buttonId, true)
      .then((button) => {
        return this.buttonService.renew(button, user)
        .then((button) => {
          notifyUser(this.eventEmitter,ActivityEventName.RenewButton,{button, owner: user})
          return button;
        }).then((button) => {
          return this.postService.renewButtonPost(user, button)
          .then((post) => {
            notifyUser(this.eventEmitter,ActivityEventName.NewPost,{post})
            
            return post;  
          })
        })
      })
    });
  }
  
  @AllowGuest()
  @Get('monthCalendar/:month/:year')
  async monthCalendar(@Param('month') month: number,@Param('year') year: number) {
    return await this.buttonService.monthCalendar((month-1), year)
  }

  @OnlyAdmin()
  @Get('moderationList/:page')
  moderationList(@Param('page') page: number, @CurrentUser() user: User)
  {
    return this.buttonService.moderationList(user, page)
  }

  @OnlyAdmin()
  @Get('approve/:buttonId')
  approve(@Param('buttonId') buttonId: string)
  {
    return this.buttonService.approve(buttonId).then((button) => {
      notifyUser(this.eventEmitter,ActivityEventName.NewButton,{button})  
    })
  }

  @OnlyRegistered()
  @Get('bulletin/:page/:take/:days')
  bulletin(@Param('page') page: number, @Param('take') take: number, @Param('days') days: number)
  {
    return this.buttonService.bulletin(page, take, days)
  }

  @AllowGuest()
  @Get('embbed/:page/:take')
  embbed(@Param('page') page: number, @Param('take') take: number)
  {
    return this.buttonService.embbed(page, take)
  }

  @AllowGuest()
  @Get('rss')
  @Header('Content-Type', 'application/xml')
  rss()
  {
    return this.buttonService.rss()
  }

}
