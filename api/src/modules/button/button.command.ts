import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ButtonCron } from './button.cron';

@Injectable()
export class ButtonCommand {
  constructor(private readonly buttonCron: ButtonCron) {}

  @Command({
    command: 'cron:buttons:removepast',
    describe: 'remove buttons with more than 3 months of inactivity',
  })
  async cronRemoveOldButtons(
    
  ) {
    this.buttonCron.clearOldButtons()
  }
}