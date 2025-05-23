import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller.js';
import { SetupService } from './setup.service.js';
import { SetupCommand } from './setup.command.js';
// import { CommandModule } from 'nestjs-command';

@Module({
  imports: [
    // CommandModule
  ],
  controllers: [SetupController],
  providers: [SetupService, SetupCommand],
})
export class SetupModule {}
