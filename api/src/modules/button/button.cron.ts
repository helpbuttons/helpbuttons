// Helpbuttons without date, wait 3 months after creation, if there's no activity in the helpbutton send email to the creator saying 'Due to lack of activity, your button is going to be erased in one month, please visit the link if you want to keep it alive. If there's no new activity it will be erased in one month.'
// If the user visits the link, a new update appears in the button : "Username updated this helpbutton for 4 months more"

// -Helpbuttons with date, one day after the conclusion date, send email to the creator saying 'Due end of event date, your button is going to be erased in 3 days, please visit the link and change the date if you want to keep it alive. If there's no new activity it will be erased in 3 days.'

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ButtonService } from './button.service';
import { EntityManager } from 'typeorm';
import { NetworkService } from '../network/network.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import translate from '@src/shared/helpers/i18n.helper';
import { getUrl } from '@src/shared/helpers/mail.helper';

@Injectable()
export class ButtonCron {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly networkService: NetworkService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly buttonService: ButtonService,
  ) {}

  @Cron('27 18 * * *', {
    name: 'clearEventButtons',
  }) // https://github.com/helpbuttons/helpbuttons/issues/508 clearing events..
  async clearEventButtons() {
    // find buttons expired
    const buttonTemplates =
      await this.networkService.getButtonTemplates();
    const buttonTemplatesEvents = buttonTemplates.filter(
      (buttonTemplate) => {
        if (!buttonTemplate.customFields) {
          return false;
        }
        const buttonTemplatesEvents =
          buttonTemplate.customFields.filter((customField) => {
            return customField.type == 'event';
          });
        if (buttonTemplatesEvents.length > 0) {
          return true;
        }
        return false;
      },
    );
    const btnTemplateEvents = buttonTemplatesEvents.map(
      (buttonTemplateEvent) => {
        return buttonTemplateEvent.name;
      },
    );

    const buttonsToExpire = await this.entityManager.query(
      `select id,title,"eventEnd","ownerId" from button where deleted = false AND type IN ('${btnTemplateEvents.join(
        "','",
      )}') AND "eventEnd" < now() - INTERVAL '1 day' AND "eventEnd" > now() - INTERVAL '2 day'`,
    );

    await Promise.all(
      buttonsToExpire.map((button) => {
        this.userService.findById(button.ownerId).then((user) => {
          return this.userService
            .getUserLoginParams(user.id)
            .then((loginParams) => {
              return this.mailService.sendWithLink({
                to: user.email,
                content: translate(
                  user.locale,
                  'button.isExpiringEventMail',
                ),
                subject: translate(
                  user.locale,
                  'button.isExpiringEventMailSubject',
                ),
                link: getUrl(
                  user.locale,
                  `/ButtonFile/${button.id}${loginParams}`,
                ),
                linkCaption: translate(
                  user.locale,
                  'email.buttonLinkCaption',
                ),
              });
            });
        });
      }),
    );

    // remove buttons after 3 days passed...
    // erase button and images
    const buttonsExpired = await this.entityManager.query(
      `select id,title,"eventEnd","ownerId" from button where deleted = false AND type IN ('${btnTemplateEvents.join(
        "','",
      )}') AND "eventEnd" < now() - INTERVAL '3 days'`,
    );
    await Promise.all(
      buttonsExpired.map((button) => {
        return this.buttonService.delete(button.id);
      }),
    );
  }

  @Cron('27 18 * * *', {
    name: 'clearOldButtons',
  })// https://github.com/helpbuttons/helpbuttons/issues/508 clearing old buttons > 3months..
  async clearOldButtons() {
    // change update button modified date when there is new post or comment: done   @OnEvent(ActivityEventName.NewPost) @OnEvent(ActivityEventName.NewPostComment) on button service
    // check if modified between interval now() - 3 months now()
    const buttonsToExpire = await this.entityManager.query(
      `select id,"eventEnd","ownerId", updated_at from button where deleted = false AND "updated_at" < now() - INTERVAL '3 months' AND ("updated_at" > now() - INTERVAL '4 months')`,
    );
    // update button set updated_at = now() - interval '3 months' where id =
    // send mail to creator
    await Promise.all(
      buttonsToExpire.map((button) => {
        this.userService.findById(button.ownerId).then((user) => {
          return this.userService
            .getUserLoginParams(user.id)
            .then((loginParams) => {
              return this.mailService.sendWithLink({
                to: user.email,
                content: translate(
                  user.locale,
                  'button.isExpiringMail',
                ),
                subject: translate(
                  user.locale,
                  'button.isExpiringMailSubject',
                ),
                link: getUrl(
                  user.locale,
                  `/ButtonFile/${button.id}${loginParams}`,
                ),
                linkCaption: translate(
                  user.locale,
                  'email.buttonLinkCaption',
                ),
              });
            });
        });
      }),
    );

    const buttonsExpired = await this.entityManager.query(
      `select id,"eventEnd","ownerId",updated_at from button where deleted = false AND "updated_at" < now() - INTERVAL '4 months'`,
    );
    await Promise.all(
      buttonsExpired.map((button) => {
        return this.buttonService.delete(button.id);
      }),
    );
  }

  @Cron('0 0 1 * *')
  async clearMediaFromButtons() {
    // older than 1 month
    await this.buttonService.findDeletedAndRemoveMedia();
  }
}
