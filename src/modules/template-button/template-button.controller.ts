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

import { CreateTemplateButtonDto, UpdateTemplateButtonDto } from './template-button.dto';
import { TemplateButtonService } from './template-button.service';
// import { FilterTemplateButtonsOrmDto } from '../dto/requests/filter-templateButtons-orm.dto';

@ApiTags('templateButtons')
@Controller('templateButtons')
export class TemplateButtonController {
  constructor(private readonly templateButtonService: TemplateButtonService) {}

  @Post('new')
  create(@Body() createDto: CreateTemplateButtonDto) {
    return this.templateButtonService.create(createDto);
  }

  // @Get('/find/')
  // async findAll(@Query() filters: FilterTemplateButtonsOrmDto) {
  //   return await this.templateButtonService.findAll(filters);
  // }

  // @Get('findById/:templateButtonId')
  // findOne(@Param('templateButtonId') templateButtonId: string) {
  //   return this.templateButtonService.findOne(templateButtonId);
  // }

  // @Patch('edit/:templateButtonId')
  // update(
  //   @Param('templateButtonId') templateButtonId: string,
  //   @Body() updateTemplateButtonDto: UpdateTemplateButtonDto,
  // ) {
  //   return this.templateButtonService.update(templateButtonId, updateTemplateButtonDto);
  // }

  // @Delete('delete/:templateButtonId')
  // async remove(@Param('templateButtonId') templateButtonId: string) {
  //   return this.templateButtonService.remove(templateButtonId);
  // }
}