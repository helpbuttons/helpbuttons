import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ButtonCron } from './button.cron';

@Injectable()
export class ButtonCommand {
  constructor(private readonly buttonCron: ButtonCron) {}

  @Command({
    command: 'cron:events:removepast',
    describe: 'remove all events which passed the due date for 3 days',
  })
  async cronRemovePastEvents(
    
  ) {
    this.buttonCron.clearEventButtons()
  }

  @Command({
    command: 'cron:buttons:removepast',
    describe: 'remove buttons with more than 3 months of inactivity',
  })
  async cronRemoveOldButtons(
    
  ) {
    this.buttonCron.clearOldButtons()
  }
}