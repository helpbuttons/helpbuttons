import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateButtonDto, UpdateButtonDto } from './button.dto';
import { ButtonService } from './button.service';
// import { FilterButtonsOrmDto } from '../dto/requests/filter-buttons-orm.dto';

@ApiTags('buttons')
@Controller('buttons')
export class ButtonController {
  constructor(private readonly buttonService: ButtonService) {}

  @Post('new/:networkId')
  create(@Param('networkId') networkId: string, @Body() createDto: CreateButtonDto) {
    return this.buttonService.create(createDto, networkId);
  }

  // @Get('/find/')
  // async findAll(@Query() filters: FilterButtonsOrmDto) {
  //   return await this.buttonService.findAll(filters);
  // }

  @Get('findById/:buttonId')
  findOne(@Param('buttonId') buttonId: string) {
    return this.buttonService.findOne(buttonId);
  }

  @Patch('edit/:buttonId')
  update(
    @Param('buttonId') buttonId: string,
    @Body() updateButtonDto: UpdateButtonDto,
  ) {
    return this.buttonService.update(buttonId, updateButtonDto);
  }

  @Delete('delete/:buttonId')
  async remove(@Param('buttonId') buttonId: string) {
    return this.buttonService.remove(buttonId);
  }
}