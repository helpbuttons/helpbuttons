import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
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
import { MailActivity } from '../mail/mail.interface';

const outboxConditions = `created_at between now() - INTERVAL '1 day' AND now()`;
@Injectable()
export class ActivityCron {
  private readonly logger = new Logger('TASKS');

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

  @Cron(CronExpression.EVERY_DAY_AT_5PM)
  async triggerNotifications() {
    this.logger.log('Starting to notify all outboxes')
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
              .then(async (activities) => {
                const loginParams = await this.userService.getUserLoginParams(user.id)
                return activities
                  .filter((_activ) => {
                    // @ts-ignore
                    if([ActivityEventName.Message, ActivityEventName.NewPostComment].indexOf(_activ.eventName) > -1)
                    {
                      return false;
                    }
                    return true;
                  })
                  .map((activity) => {
                  return this.transformActivityOutbox(activity, user.locale, user.id, loginParams);
                })
              })
              .then((activities) => {
                this.logger.log(`Sending email to ${user.email} with ${activities.length} activities`)
                this.sendDailyUserOutbox(user, activities);
              })
          })
    })
    )
  }


  public transformActivityOutbox(activity, locale, userId, loginParams): MailActivity {
    let activityOut = this.activityService.transformActivity(activity, locale, userId)
    if (activity.eventName == ActivityEventName.Message) {
      return {
        content: translate(locale, 'activities.newMessageOutbox', [activityOut.activityFrom.name, activityOut.message]),
        link: this.activityService.addLoginParams(getUrl(`/Activity/button/${activityOut.buttonId}`), loginParams),
        linkCaption: activityOut.linkCaption
      }
    }
    
    const link = activityOut.link ? this.activityService.addLoginParams(getUrl(`/Activity/button/${activityOut.buttonId}`), loginParams) : null

    return {
      content: activityOut.message,
      link,
      linkCaption: activityOut.linkCaption
    }
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

  sendDailyUserOutbox(user, outbox: MailActivity[]) {

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
  }
}
