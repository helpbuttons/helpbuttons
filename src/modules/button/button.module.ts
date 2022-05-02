import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonService } from './button.service';
import { ButtonController } from './button.controller';
import { Button } from './button.entity';
import { TagModule } from '../tag/tag.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Button]),
    TagModule
  ],
  controllers: [
    ButtonController
  ],
  providers: [
    ButtonService
  ],
})
export class ButtonModule {}
