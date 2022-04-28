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

import { CreateButtonDto } from '../dto/requests/create-button.dto';
import { UpdateButtonDto } from '../dto/requests/update-button.dto';
import { ButtonOrmService } from '../providers/typeorm/buttonOrm.service';
import { FilterButtonsOrmDto } from '../dto/requests/filter-buttons-orm.dto';

@ApiTags('Orm')
@Controller('buttonsOrm')
export class ButtonOrmController {
  constructor(private readonly buttonService: ButtonOrmService) {}

  @Post()
  create(@Body() createButtonDto: CreateButtonDto) {
    return this.buttonService.create(createButtonDto);
  }

  @Get()
  async findAll(@Query() filters: FilterButtonsOrmDto) {
    return await this.buttonService.findAll(filters);
  }

  @Get(':buttonId')
  findOne(@Param('buttonId') buttonId: string) {
    return this.buttonService.findOne(buttonId);
  }

  @Patch(':buttonId')
  update(
    @Param('buttonId') buttonId: string,
    @Body() updateButtonDto: UpdateButtonDto,
  ) {
    return this.buttonService.update(buttonId, updateButtonDto);
  }

  @Delete(':buttonId')
  async remove(@Param('buttonId') buttonId: string) {
    return this.buttonService.remove(buttonId);
  }
}