import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { Between, EntityManager, Repository } from 'typeorm';
import { ActivityEventName } from '@src/shared/types/activity.list';
import translate, {
  readableDate,
} from '@src/shared/helpers/i18n.helper';
import { UserService } from '../user/user.service';
import { getUrl } from '@src/shared/helpers/mail.helper';
import { NetworkService } from '../network/network.service';
import { ActivityService } from './activity.service';
import { MailButtonActivity } from '../mail/mail.interface';
import { unique } from '@src/shared/helpers/array.helper';

const outboxConditions = `activity.created_at between now() - INTERVAL '1 day' AND now()`;
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
    
    const dailyActivities = await this.findActivitiesOfDay()
    const consumers = unique(dailyActivities.filter((t) => t?.consumerId).map((t) => t.consumerId))
    const owners = unique(dailyActivities.map((t) => t.ownerId))
    const userIds = unique([...consumers, ...owners])
    
    await Promise.all(
      userIds.map((userId) => {
        return this.userService.findById(userId)
          .then((user) => {
              return this.activityRepository.find({
                where: [
                  { 
                    consumer: { id: user.id },
                    created_at: Between(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date())
                  },
                  { 
                    button: { owner: { id: user.id } },
                    created_at: Between(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date())
                  }, 
                ],
                relations: ['button.owner', 'to', 'from', 'consumer'],
                order: { created_at: 'DESC' },
              })
              .then(async (activities) => {
                const loginParams = await this.userService.getUserLoginParams(user.id)
                const btnTypes = await this.networkService.findButtonTypes()

                const filteredActivities = activities
                .filter((_activ) => {
                  // @ts-ignore
                  if([ActivityEventName.NewButton, ActivityEventName.Message, ActivityEventName.NewPostComment, ActivityEventName.DeleteButton].indexOf(_activ.eventName) > -1)
                  {
                    return false;
                  }
                  if(_activ.eventName == ActivityEventName.NewFollowingButton){
                    if(_activ.consumer.id == user.id){
                      return false;
                    }
                  }
                  return true;
                });
                // console.log(filteredActivities.map((ac) => { return {eventName: ac.eventName, createdAt: ac.created_at, title: ac.button.title, consumerId: ac?.consumer?.id, owner: ac?.button?.owner?.id, userid: user.id} }))
                return filteredActivities.map((activity) => {
                  return this.transformActivityOutbox(activity, user.locale, user.id, loginParams, btnTypes);
                })
              })
              .then((activities) => {
                if(activities?.length > 0){
                  this.logger.log(`Sending email to ${user.email} with ${activities.length} activities`)
                  this.sendDailyUserOutbox(user, activities);
                }
              })
          })
    })
    )
  }


  public transformActivityOutbox(activity, locale, userId, loginParams, btnTypes): MailButtonActivity {
    let activityOut = this.activityService.transformActivity(activity, locale, userId)
    const button = activity.button;
    const btnType = btnTypes.find((btnType) => btnType.name == button.type)
    const btnTypeCaption = `${btnType.icon} ${btnType?.caption}`
    if (activity.eventName == ActivityEventName.Message) {
      return {
        content: translate(locale, 'activities.newMessageOutbox', [activityOut.activityFrom.name, activityOut.message]),
        link: this.activityService.addLoginParams(getUrl(`/Activity/button/${activityOut.buttonId}`), loginParams),
        linkCaption: activityOut.linkCaption,
        type: btnTypeCaption, 
        title: button.title, 
        address: button.address,
      }
    }
    
    const link = activityOut.link ? this.activityService.addLoginParams(getUrl(`/Activity/button/${activityOut.buttonId}`), loginParams) : null
 
    return {
      content: activityOut.message,
      link,
      linkCaption: activityOut.linkCaption,
      type: btnTypeCaption, 
      title: button.title, 
      address: button.address
    }
  }

  public findActivitiesOfDay() {
    return this.entityManager.query(`select button."ownerId","consumerId", activity.created_at, "eventName" from activity, button where button.id = "buttonId" AND  ${outboxConditions} `)
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

  sendDailyUserOutbox(user, outbox: MailButtonActivity[]) {

      return this.networkService
        .findDefaultNetwork()
        .then((network) => {
          const date = readableDate(user.locale)
          return this.mailService.sendDailyOutbox({
            activities: outbox,
            to: user.email,
            subject: translate(user.locale, 'email.dailyOutBox', [
              outbox.length.toString(),
              network.name,
              readableDate(user.locale),
            ]),
            networkName: network.name,
            date: date
          });
        });
  }
}
