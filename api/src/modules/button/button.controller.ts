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
  OnlyRegistered,
} from '@src/shared/decorator/roles.decorator';
import { AllowIfNetworkIsPublic } from '@src/shared/decorator/privacy.decorator';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { EventEmitter2 } from '@nestjs/event-emitter'
import { notifyUser } from '@src/app/app.event';
import { ActivityEventName } from '@src/shared/types/activity.list';

@ApiTags('buttons')
@Controller('buttons')
export class ButtonController {
  constructor(
    private readonly buttonService: ButtonService,
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
  async create(
    @Query('networkId') networkId: string,
    @UploadedFiles() images,
    @Body() createDto: CreateButtonDto,
    @CurrentUser() user: User,
  ) {
    return await this.buttonService.create(
      createDto,
      networkId,
      images,
      user,
    ).then((button) => {
      notifyUser(this.eventEmitter,ActivityEventName.NewButton,button, button.owner)
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
    return await this.buttonService.findh3(resolution, hexagons);
  }

  @AllowGuest()
  @AllowIfNetworkIsPublic()
  @Get('findById/:buttonId')
  async findOne(@Param('buttonId') buttonId: string) {
    return await this.buttonService.findById(buttonId);
  }

  @OnlyRegistered()
  @Post('update/:buttonId')
  async update(
    @Param('buttonId') buttonId: string,
    @Body() updateDto: UpdateButtonDto,
    @CurrentUser() user: User,
  ) {
    return await this.buttonService
      .isOwner(user, buttonId)
      .then((isOwner) => {
        if (!isOwner) {
          throw new CustomHttpException(ErrorName.NoOwnerShip);
        }
        return this.buttonService.update(buttonId, updateDto);
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
          return true;
        });
      });
  }
}
