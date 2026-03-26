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
import { ActivityService } from './activity.service';
import { ActivityDtoOut } from './activity.dto';

const outboxConditions = `created_at between now() - INTERVAL '2 day' AND now()`;
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
    private readonly activityService: ActivityService,
  ) {}

  @Cron('27 18 * * *', {
    name: 'notifications',
  })
  async triggerNotifications() {
    const usersWithPendingNotifications =
      await this.findUsersWithPendingNotifications();
    await Promise.all(
      usersWithPendingNotifications.map((userNotif) => {
        return this.userService.findById(userNotif.id)
          .then((user) => {
            return this.activityRepository.find({
              where: [
                { consumer: { id: user.id }, outbox: true },
              ],
              relations: ['button.owner', 'to', 'from', 'consumer'],
              order: { created_at: 'DESC' },
            })
              .then((activities) => {
                return activities.map((activity) => {
                  return this.transformActivityOutbox(activity, user.locale, user.id);
                })
              })
              .then((activities) => {
                this.sendDailyUserOutbox(user, activities);
              })
          })
    })
    )
  }

  public transformActivityOutbox(activity, locale, userId) {
    let activityOut = this.activityService.transformActivity(activity, locale, userId)
    if(activity.eventName == ActivityEventName.Message) {
        activityOut = {...activityOut, message: translate(locale, 'activities.newMessageOutbox', [activityOut.activityFrom.name, activityOut.message])}
    }
    return activityOut;
  }
  public findUsersWithPendingNotifications() {
    return this.entityManager.query(
      `select "consumerId" as id, count(id) as numberActivities from activity where outbox = true AND ${outboxConditions} group by "consumerId"`,
    );
  }

  public setAsSent() {
    return this.entityManager.query(
      `update activity set outbox = false WHERE ${outboxConditions}`,
    );
  }

  getUserOutBox(userId): Promise<Activity[]> {
    return this.activityRepository
      .createQueryBuilder('activity')
      .where(
        `outbox = true AND ${outboxConditions} AND "consumerId" = :consumerId`,
        { consumerId: userId },
      )
      .getMany();
  }

  sendDailyUserOutbox(user, outbox: ActivityDtoOut[]) {

      return this.networkService
        .findDefaultNetwork()
        .then((network) => {
          return this.mailService.sendDailyOutbox({
            activities: outbox,
            to: user.email,
            subject: translate(user.locale, 'email.dailyOutBox', [
              outbox.length.toString(),
              network.name,
              readableDate(user.locale),
            ]),
          });
        });
    // });
  }
}
