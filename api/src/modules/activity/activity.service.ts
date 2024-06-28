import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { EntityManager, In, Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import translate from '@src/shared/helpers/i18n.helper';
import { getUrl } from '@src/shared/helpers/mail.helper';
import { ButtonService } from '../button/button.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly buttonService: ButtonService,
  ) {}

  @OnEvent(ActivityEventName.NewPost)
  async onNewPost(payload: any) {
    const button_ = payload.data.post.button;
    // check users following the button of this post, and add a new actitivy to the daily outbox
    this.buttonService.findById(button_.id).then(async (button) => {
      const usersFollowing =
      await this.userService.findAllByIdsToBeNotified(
        button.followedBy,
      );
    
      // notify users following button...
      await Promise.all(
        usersFollowing.map((user) => {
          return this.newActivity(user, payload, true);
        }),
      );

      // notify button owner
      await this.newActivity(button.owner, payload, false);
    })
    
     
  }

  @OnEvent(ActivityEventName.NewPostComment)
  async onNewPostComment(payload: any) {
    // notify
    // - dont send mail to author of comment
    // - send mail to owner of button if owner is not author
    // - notify users mentioned on comment
    const comment = payload.data.comment;
    const message = comment.message;
    const author = comment.author;

    // check users mentioned in comment, and notify them, not on outbox, but directly
    await this.findUserMentionsInMessage(
      message,
      author.username,
    ).then((usersMentioned) => {
      return Promise.all(
        usersMentioned.map((user) => {
          return this.userService
            .getUserLoginParams(user.id)
            .then((loginParams) => {
              this.mailService.sendWithLink({
                to: user.email,
                content: translate(
                  user.locale,
                  'activities.newcomment',
                  [author.username, user.username, message],
                ),
                subject: translate(
                  user.locale,
                  'activities.newcommentSubject',
                ),
                link: getUrl(
                  user.locale,
                  `/ButtonFile/${comment.button.id}${loginParams}`,
                ),
                linkCaption: translate(
                  user.locale,
                  'email.buttonLinkCaption',
                ),
              });
              return this.newActivity(user, payload, false);
            });
        }),
      );
    });

    // notify author:
    await this.newActivity(author, payload, false);
  }
  @OnEvent(ActivityEventName.NewButton)
  async onNewButton(payload: any) {
    const button_ = payload.data.button;
    // check users following the button of this post, and add a new actitivy to the daily outbox
    this.buttonService.findById(button_.id).then(async (button) => {
      // calculate users to be notified:
      // - check users with this interests/tags
      // - if radius = 0, include user, else check if user is in radius.!
      const getUsersToNotify = (button) => {
        const tagQuery = button.tags
          .map((tag) => `'${tag}' = any(tags)`)
          .join(' OR ');
        const query = `select id, radius,center,ST_Distance(center, ST_Point(${button.longitude}, ${button.latitude},4326)::geography ) / 1000 as distance, tags from public.user where ${tagQuery}`;
        return this.entityManager
          .query(query)
          .then((usersDistanceToNotify) => {
            return usersDistanceToNotify.filter((user) => {
              if (user.radius < 1) {
                return true;
              } else {
                if (user.distance <= user.radius) {
                  return true;
                }
              }
              return false;
            });
          });
      };

      if (button?.tags && button.tags.length > 0) {
        const usersIds = (await getUsersToNotify(button))
          .map((user) => user.id)
          .filter((userId) => userId != button.owner.id);
        const usersToNotify =
          await this.userService.findAllByIdsToBeNotified(usersIds);

        // notify users following this tag
        await Promise.all(
          usersToNotify.map((user) => {
            // auto follow button!
            return this.buttonService
              .follow(button.id, user.id)
              .then(() => {
                // add new button to activity of user following interest in their radius!
                return this.newActivity(user, payload, true);
              });
          }),
        );
      }
      
      await this.newActivity(button.owner, payload, false);
    })
  }

  @OnEvent(ActivityEventName.DeleteButton)
  async onDeleteButton(payload: any) {
    const {user, button} = payload.data;
    // notify button owner
    await this.newActivity(button.owner, payload, false);
  }
  @OnEvent(ActivityEventName.RenewButton)
  async onRenewButton(payload: any) {
    console.log('doing nothing for now');
    // https://github.com/helpbuttons/helpbuttons/issues/703
    // deactivating this email
    // {
    //   const owner = payload.data.owner;
    //   const button = payload.data.button;
    //   return this.userService.getUserLoginParams(owner.id).then(
    //     (loginParams) => {
    //   this.mailService.sendWithLink({
    //         to: owner.email,
    //         content: translate(owner.locale, 'button.renewMail', [button.title]),
    //         subject: translate(owner.locale, 'button.renewMailSubject'),
    //         link: getUrl(
    //           owner.locale,
    //           `/ButtonFile/${button.id}${loginParams}`,
    //         ),
    //         linkCaption: translate(
    //           owner.locale,
    //           'email.buttonLinkCaption',
    //         ),
    //       })
    //     })
    // }
  }
  @OnEvent(ActivityEventName.ExpiredButton)
  async onExpiredButton(payload: any) {
    const {button} = payload.data;
    await this.newActivity(button.owner, payload, false);
    /*notifyOwnerExpiredButton(button: Partial<Button>, isEvent: boolean = false)
    {
      return this.userService
              .findById(button.owner.id)
              .then((user) => {
                return this.userService
                  .getUserLoginParams(user.id)
                  .then((loginParams) => {
                    let content_ = 'button.isExpiringMail'
                    let subject_ = 'button.isExpiringMailSubject'
                    if(isEvent)
                    {
                      content_ = 'button.isExpiringEventMail'
                      subject_ = 'button.isExpiringEventMailSubject'
                    }
                    return this.mailService.sendWithLink({
                      to: user.email,
                      content: translate(
                        user.locale,
                        content_,
                        [button.title],
                      ),
                      subject: translate(
                        user.locale,
                        subject_,
                      ),
                      link: getUrl(
                        user.locale,
                        `/ButtonRenew/${button.id}${loginParams}`,
                      ),
                      linkCaption: translate(
                        user.locale,
                        'email.buttonLinkCaption',
                      ),
                    });
                  });
              })
    }*/
  }

  @OnEvent(ActivityEventName.NewFollowingButton)
  async newFollowingButton(payload: any) {
    const { user, button } = payload.data;
    this.newActivity(user, payload, false);
  }

  @OnEvent(ActivityEventName.NewFollowedButton)
  async newFollowedButton(payload: any) {
    const { user, button } = payload.data;
    this.newActivity(button.owner, payload, false);
  }

  findByUserId(userId: string) {
    return this.activityRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
      order: { created_at: 'DESC' },
    }).then((activities) => {
      return activities.map((activity) => 
      {
        return activity
      })
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

  async findUserMentionsInMessage(message, authorOfMessage) {
    var userPattern = /@[\w]+/gi;
    let usernames = message.match(userPattern);

    if (!usernames) {
      return [];
    }

    const usernamesMentioned = usernames
      .map((username) => username.substring(1))
      .filter((username) => username != authorOfMessage);

    return await Promise.all(
      usernamesMentioned.map(async (username) => {
        return await this.userService.findByUsername(username);
      }),
    );
  }

  newActivity(user, payload, addToDailyMailResume = false) {
    console.log(
      `new activity [${user.username}] ${payload.activityEventName} outbox? ${addToDailyMailResume}`,
    );
    
    const activity = {
      id: dbIdGenerator(),
      owner: user,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
      outbox: addToDailyMailResume,
    };
    return this.activityRepository.insert([activity]);
  }

  public deleteme(authorId: string)
  {
    return this.activityRepository
        .delete({owner: {id: authorId}})
  }

  public findNetworkActivity()
  {
    const typesOfActivityToShow = [ActivityEventName.NewButton, ActivityEventName.NewPost];
    return this.activityRepository.find({take: 5, order: { created_at: 'DESC' }, where: {eventName: In(typesOfActivityToShow)}})
  }
}
