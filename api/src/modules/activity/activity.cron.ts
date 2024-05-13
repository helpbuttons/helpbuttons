import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { Cron } from '@nestjs/schedule';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { EntityManager, Repository } from 'typeorm';
import { ActivityEventName } from '@src/shared/types/activity.list';
import translate, {
  readableDate,
} from '@src/shared/helpers/i18n.helper';
import { UserService } from '../user/user.service';
import { getUrl } from '@src/shared/helpers/mail.helper';
import { NetworkService } from '../network/network.service';

const outboxConditions = `created_at between now() - INTERVAL '2 day' AND now()`
@Injectable()
export class ActivityCron {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly networkService: NetworkService,
  ) {}

  @Cron('27 18 * * *', {
    name: 'notifications',
  })
  async triggerNotifications() {
    const usersWithPendingNotifications =
      await this.findUsersWithPendingNotifications();
    await Promise.all(
      usersWithPendingNotifications.map((user) => {
        return this.getUserOutBox(user.id).then((outboxUser) => {
          return this.sendDailyUserOutbox(user.id, outboxUser);
        });
      }),
    );
    await this.setAsSent()
  }

  public findUsersWithPendingNotifications() {
    return this.entityManager.query(
      `select "ownerId" as id, count(id) as numberActivities from activity where outbox = true AND ${outboxConditions} group by "ownerId"`,
    );
  }

  public setAsSent() {
    return this.entityManager.query(
      `update activity set oubox = false WHERE ${outboxConditions}`,
    );
  }

  getUserOutBox(userId): Promise<Activity[]> {
    return this.activityRepository
      .createQueryBuilder('activity')
      .where(
        `outbox = true AND ${outboxConditions} AND "ownerId" = :ownerId`,
        { ownerId: userId },
      )
      .getMany();
  }

  sendDailyUserOutbox(userId, outbox: Activity[]) {
    return this.userService.findById(userId).then((user) => {
      const activitiesToSend = outbox.map((activity) => {
        const payload = JSON.parse(activity.data);
        switch (activity.eventName) {
          case ActivityEventName.NewPost:
            return {
              content: translate(user.locale, 'activities.newpost', [
                payload.message,
                payload.button.title,
                payload.author.username,
              ]),
              link: getUrl(
                user.locale,
                `/ButtonFile/${payload.button.id}`,
              ),
              linkCaption: translate(
                user.locale,
                'email.buttonLinkCaption',
              ),
            };

            // add to email to send...
            break;
          case ActivityEventName.NewButton:
            // add to email to send...
            return {
              content: translate(
                user.locale,
                'activities.newbutton',
                [payload.title, payload.address],
              ),
              link: getUrl(user.locale, `/ButtonFile/${payload.id}`),
              linkCaption: translate(
                user.locale,
                'email.buttonLinkCaption',
              ),
            };
            break;
          default:
            return null;
        }
      });
      return this.networkService
        .findDefaultNetwork()
        .then((network) => {
          return this.mailService.sendDailyOutbox({
            activities: activitiesToSend,
            to: user.email,
            subject: translate(user.locale, 'email.dailyOutBox', [
              activitiesToSend.length.toString(),
              network.name,
              readableDate(user.locale),
            ]),
          });
        });
    });
  }
}
