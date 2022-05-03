import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateButtonService } from './template-button.service';
import { TemplateButtonController } from './template-button.controller';
import { TemplateButton } from './template-button.entity';


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
