import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('findByTag/:tag')
  findOne(@Param('tag') tag: string) {
    return this.tagService.find(tag);
  }
}
