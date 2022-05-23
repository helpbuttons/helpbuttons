import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateButtonDto, UpdateButtonDto } from './button.dto';
import { ButtonService } from './button.service';
// import { FilterButtonsOrmDto } from '../dto/requests/filter-buttons-orm.dto';

@ApiTags('buttons')
@Controller('buttons')
export class ButtonController {
  constructor(private readonly buttonService: ButtonService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('new')
  create(@Query('networkId') networkId: string, @Body() createDto: CreateButtonDto) {
    return this.buttonService.create(createDto, networkId);
  }

  @Get('/find/')
  async findAll() {
    return await this.buttonService.findAll();
  }

  @Get('findById/:buttonId')
  findOne(@Param('buttonId') buttonId: string) {
    return this.buttonService.findOne(buttonId);
  }

  @Patch('edit/:buttonId')
  update(
    @Param('buttonId') buttonId: string,
    @Body() updateDto: UpdateButtonDto,
  ) {
    return this.buttonService.update(buttonId, updateDto);
  }

  @Delete('delete/:buttonId')
  async remove(@Param('buttonId') buttonId: string) {
    return this.buttonService.remove(buttonId);
  }
}