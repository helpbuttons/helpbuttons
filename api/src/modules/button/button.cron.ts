import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ButtonService } from './button.service';
import { EntityManager } from 'typeorm';
import { NetworkService } from '../network/network.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { CustomFields } from '@src/shared/types/customFields.type';

@Injectable()
export class ButtonCron {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly networkService: NetworkService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly buttonService: ButtonService,
  ) {}


  @Cron(CronExpression.EVERY_3_HOURS, {
    name: 'clearEventButtons',
  }) // https://github.com/helpbuttons/helpbuttons/issues/508 clearing events..
  async clearEventButtons() {
    // find buttons expired
      const buttonTemplates = await this.networkService.findButtonTypes()
      const expiringButtonTemplates = buttonTemplates.filter((buttonTemplate) => {
        if (!buttonTemplate.customFields) {
          return false;
        }
        const buttonTemplatesEvents =
          buttonTemplate.customFields.filter((customField) => {
            return [CustomFields.Event, CustomFields.Scheduler].indexOf(customField.type as CustomFields) > -1
          });
        if (buttonTemplatesEvents.length > 0) {
          return true;
        }
        return false;
      })

      const expiringButtonTemplatesCustomFields = expiringButtonTemplates.map((template) => {
        return {name: template.name, customFields: template.customFields.map((_csm) => _csm.type)}
      })
      const expiringButtonTemplatesNames = expiringButtonTemplatesCustomFields.map((e) => e.name)

      const q = 
      `select id,title,"eventEnd","ownerId", "expirationDate", "followedBy", type from button where deleted = false 
      AND type IN ('${expiringButtonTemplatesNames.join("','")}')
      AND expired = false
      AND ("eventEnd" < now() - INTERVAL '1 days'
      OR "expirationDate" < now())`;
    const eventsAndScheduledExpired = await this.entityManager.query(q);
    console.log(eventsAndScheduledExpired)
    await Promise.all(
      eventsAndScheduledExpired.map((button) => {
        const customFields = expiringButtonTemplatesCustomFields.find((_elm) => _elm.name == button.type)
        console.log(customFields)
        if(customFields.customFields.indexOf(CustomFields.Scheduler) > -1){
          console.log('check scheduler')
          return this.buttonService.checkAndSetExpiredScheduler(button);
        }
        if(customFields.customFields.indexOf(CustomFields.Event) > -1){
          console.log('check event')
          return this.buttonService.checkAndSetExpiredEvent(button);
        }
      }),
    );
  }

  @Cron('0 0 1 * *')
  async clearMediaFromButtons() {
    // older than 1 month
    // await this.buttonService.findDeletedAndRemoveMedia();
  }
}
