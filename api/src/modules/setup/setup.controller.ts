import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { HttpStatus } from '@src/shared/types/http-status.enum';

import { ApiTags } from '@nestjs/swagger';
import { SetupDto, SetupDtoOut } from './setup.entity';
import { SetupService } from './setup.service';

@ApiTags('setup')
@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}
  @Post('save')
  async save(@Body() setupDto: SetupDto) {
    return this.setupService.save(setupDto);
  }

  @Get('')
  async get(): Promise<SetupDtoOut> {
    return this.setupService.get()
    .then((setupDtoOut: SetupDtoOut) => {
      return setupDtoOut
    });
  }

  @Post('smtpTest')
  async smtpTest(@Body() smtpUrl: any) {
    await this.setupService.smtpTest(smtpUrl.smtpUrl);
  }
}
