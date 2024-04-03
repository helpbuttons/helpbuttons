import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { SetupCommand } from './setup.command';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [
    CommandModule
  ],
  controllers: [SetupController],
  providers: [SetupService, SetupCommand],
})
export class SetupModule {}
