import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonService } from './providers/button.service';
import { ButtonController } from './controllers/button.controller';
import { Button } from './providers/button.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Button]),
  ],
  controllers: [
    ButtonController
  ],
  providers: [
    ButtonService
  ],
})
export class ButtonModule {}
