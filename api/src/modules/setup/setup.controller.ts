import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetupDto } from './setup.entity';
import { SetupService } from './setup.service';

@ApiTags('setup')
@Controller('setup')
export class SetupController {

  constructor(private readonly setupService: SetupService) {}
//   curl -X POST http://localhost:3001/setup/save
  @Post('save')
  async save(@Body() setupDto: SetupDto) {
    this.setupService.save(setupDto)
  }

  @Get('')
  async get() {
    return this.setupService.get();
  }

  @Post('smtpTest')
  async smtpTest(smtpUrl: string) {
    let smtpOk:boolean = await this.setupService.smtpTest(smtpUrl);
    if (!smtpOk) {
      throw new HttpException(
        { message: "SMTP configuration failed." },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return "OK";
  }
}
