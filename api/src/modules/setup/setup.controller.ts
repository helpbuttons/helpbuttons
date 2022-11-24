import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetupDto } from './setup.entity';
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
  async get() {
    return this.setupService.get();
  }

  @Post('smtpTest')
  async smtpTest(@Body() smtpUrl: any) {
    await this.setupService.smtpTest(smtpUrl.smtpUrl);
  }
}
