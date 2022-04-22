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

import { ButtonService } from '../providers/button.service';
import { CreateButtonDto } from '../dto/requests/create-button.dto';
import { UpdateButtonDto } from '../dto/requests/update-button.dto';
import { FilterButtonsDto } from '../dto/requests/filter-buttons.dto';

@ApiTags('Button')
@Controller('buttons')
export class ButtonController {
  constructor(private readonly buttonService: ButtonService) {}

  @Post()
  create(@Body() createButtonDto: CreateButtonDto) {
    return this.buttonService.create(createButtonDto);
  }

  @Get()
  async findAll(@Query() filters: FilterButtonsDto) {
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
    return await this.buttonService.remove({
      where: { id: buttonId },
    });
  }
}
