import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateButtonService } from './template-button.service.js';
import { TemplateButtonController } from './template-button.controller.js';
import { TemplateButton } from './template-button.entity.js';


@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateButton]),
  ],
  controllers: [
    TemplateButtonController
  ],
  providers: [
    TemplateButtonService
  ],
})
export class TemplateButtonModule {}
