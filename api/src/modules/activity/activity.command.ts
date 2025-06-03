// import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ActivityCron } from './activity.cron.js';

@Injectable()
export class ActivityCommand {
  constructor(private readonly activityCron: ActivityCron) {}

  // @Command({
  //   command: 'cron:activity:daily',
  //   describe: 'show users with pending notifications',
  // })
  async cronRemovePastEvents(
    
  ) {
    await this.activityCron.triggerNotifications()
    // const usersWithPendingNotifications = await this.activityCron.findUsersWithPendingNotifications();

    // await Promise.all(
    //   usersWithPendingNotifications.map((user) => {
    //     return this.activityCron.getUserOutBox(user.id)
    //     .then((outboxUser) => console.log(outboxUser))
    //   }),
    // );
  }
}