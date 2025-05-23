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
import { HttpStatus } from '@src/shared/types/http-status.enum.js';

import { ApiTags } from '@nestjs/swagger';
import { SetupDto, SetupDtoOut, SmtpConfigTest } from './setup.entity.js';
import { SetupService } from './setup.service.js';

@ApiTags('setup')
@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}
  
  @Get('')
  async get(): Promise<SetupDtoOut> {
    return await this.setupService.get()
    .then((setupDtoOut: SetupDtoOut) => {
      return setupDtoOut
    });
  }

  @Post('smtpTest')
  async smtpTest(@Body() smtpConfigTest: SmtpConfigTest) {
    return await this.setupService.smtpTest(smtpConfigTest);
  }
}
