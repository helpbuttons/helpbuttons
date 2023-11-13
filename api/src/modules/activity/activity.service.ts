import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { EntityManager, Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import translate from '@src/shared/helpers/i18n.helper';
import { getUrl } from '@src/shared/helpers/mail.helper';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @OnEvent(ActivityEventName.NewPost)
  @OnEvent(ActivityEventName.NewPostComment)
  @OnEvent(ActivityEventName.NewButton)
  @OnEvent(ActivityEventName.DeleteButton)
  async notifyOwner(payload: any) {
    const message = payload.data.message;
    const author = payload.data.author;
    const button = payload.data.button;
    switch (payload.activityEventName) {
      /*
      if activity is marked as "outbox" it means it will be used on the daily mail send with a resume of activities
      */
      case ActivityEventName.NewPostComment:
        // check users mentioned in comment, and notify them, not on outbox, but directly
        const usersMentioned = await this.findUserMentionsInMessage(
          message,
          author.username,
        );
        await Promise.all(
          usersMentioned.map((user) => {
            return this.notifyNewComment(user, message, button, author);
          }),
        );
        break;
      case ActivityEventName.NewPost:
        // check users following the butotn of this post, and add a new actitivy to the daily outbox
        const usersFollowing = await this.userService.findAllByIds(
          button.followedBy,
        );
        await Promise.all(
          usersFollowing.map((user) => {
           return this.notifyNewPost(user, payload);
          }),
        );
        break;
      case ActivityEventName.NewButton:
        // calculate users to be notified:
        // - check users with this interests/tags
        // - check users which are following this hexagons!
        break;
    }
    await this.notifyOwnerOfActivity(payload);
  }

  findByUserId(userId: string) {
    return this.activityRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
      order: { created_at: 'DESC' },
    });
  }

  markAllAsRead(userId: string) {
    return this.activityRepository.update(
      { read: false, owner: { id: userId } },
      { read: true },
    );
  }

  markAsRead(userId: string, notificationId: string) {
    return this.activityRepository.update(
      { id: notificationId, owner: { id: userId } },
      { read: true },
    );
  }

  async findUserMentionsInMessage(message, authorUsername) {
    var userPattern = /@[\w]+/gi;
    let usernames = message.match(userPattern);

    if (!usernames) {
      return [];
    }
    const usernamesMentioned = usernames
      .map((username) => username.substring(1))
      .filter((username) => username != authorUsername);

    let users = await Promise.all(
      usernamesMentioned.map(async (username) => {
        return await this.userService.findByUsername(username);
      }),
    );
    return users.filter((user) => user?.receiveNotifications);
  }

  notifyNewComment(user, message, button, author) {
    return this.mailService.sendWithLink({
      content: translate(user.locale, 'activities.newcomment', [
        message,
        button.title,
        author.username,
      ]),
      to: user.email,
      link: getUrl(user.locale, `/ButtonFile/${button.id}`),
      linkCaption: translate(user.locale, 'email.buttonLinkCaption'),
      subject: translate(user.locale, 'email.activitySubject'),
    });
  }

  notifyOwnerOfActivity(payload) {
    return this.activityRepository.insert([
      {
        id: dbIdGenerator(),
        owner: payload.destination,
        eventName: payload.activityEventName,
        data: JSON.stringify(payload.data),
      },
    ]);
  }

  notifyNewPost(user, payload) {
    const activity = {
      id: dbIdGenerator(),
      owner: user,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
      outbox: true,
    };
    return this.activityRepository.insert([activity]);
  }
}
