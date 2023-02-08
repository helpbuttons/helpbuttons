import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
  imports: [
    TypeOrmModule
  ],
  controllers: [SetupController],
  providers: [SetupService],
})
export class SetupModule {}
