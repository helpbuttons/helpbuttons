import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { Activity } from './activity.entity';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import translate from '@src/shared/helpers/i18n.helper';
import { getUrl } from '@src/shared/helpers/mail.helper';
import { ButtonService } from '../button/button.service';
import {
  getButtonActivity,
  getUserActivity,
  transformToMessage,
} from './activity.transform';
import { NetworkService } from '../network/network.service';
import { ActivityDtoOut, ActivityMessageDto } from './activity.dto';
import { Button } from '../button/button.entity';
import { User } from '../user/user.entity';

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
    private readonly networkService: NetworkService,
  ) {}

  @OnEvent(ActivityEventName.NewPost)
  async onNewPost(payload: any) {
    const button_ = payload.data.post.button;
    // check users following the button of this post, and add a new actitivy to the daily outbox
    return this.buttonService
      .findById(button_.id)
      .then(async (button) => {
        const usersFollowing =
          await this.userService.findAllByIdsToBeNotified(
            button.followedBy,
          );

        // notify users following button...
        await Promise.all(
          usersFollowing.map((user) => {
            return this.createActivity(user, payload, true);
          }),
        );

        // notify button owner
        return this.createActivity(button.owner, payload, false);
      })
      .then(() => {
        return this.newNetworkActivity(payload);
      });
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
          // notify all users which are mentioned in the message
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
            });
        }),
      );
    });

    // notify owner of the button! (to mail and notifications)
    const button = comment.button;
    const owner = button.owner;
    await this.userService
      .getUserLoginParams(owner.id)
      .then((loginParams) => {
        this.userService.notifyMail(
          owner.id,
          translate(owner.locale, 'activities.newcomment', [
            author.username,
            owner.username,
            message,
          ]),
          translate(owner.locale, 'activities.newcommentSubject'),
          getUrl(
            owner.locale,
            `/ButtonFile/${comment.button.id}${loginParams}`,
          ),
          translate(owner.locale, 'email.buttonLinkCaption'),
        );

        // create new notification for owner of the button
        return this.createActivity(owner, payload, false);
      });

    // create new notification for author of the comment
    await this.createActivity(author, payload, false, true);
  }

  @OnEvent(ActivityEventName.NewButton)
  async onNewButton(payload: any) {
    const button_ = getButtonActivity(payload.data);
    // check users following the button of this post, and add a new actitivy to the daily outbox
    return this.buttonService
      .findById(button_.id)
      .then(async (button) => {
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
                  return this.createActivity(user, payload, true);
                });
            }),
          ).catch((err) => {
            console.log(payload);
            console.log(err);
          });
        }

        return this.createActivity(button.owner, payload, false);
      })
      .then(() => {
        return this.newNetworkActivity(payload);
      });
  }

  @OnEvent(ActivityEventName.DeleteButton)
  async onDeleteButton(payload: any) {
    const button = getButtonActivity(payload.data);
    const user = getUserActivity(payload.data);

    return this.entityManager
      .query(
        `delete from activity WHERE (data->'button'->'id' @> '"${button.id}"' OR data->'post'->'button'->'id' @> '"${button.id}"' OR data->'comment'->'button'->'id' @> '"${button.id}"')`,
      )
      .then(() => {
        return this.createActivity(button.owner, payload, false);
      });
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
    const { button } = payload.data;

    // delete from home info
    await this.createActivity(button.owner, payload, false);
  }

  @OnEvent(ActivityEventName.NewFollowingButton)
  async newFollowingButton(payload: any) {
    const { user, button } = payload.data;
    this.createActivity(user, payload, false);
  }

  @OnEvent(ActivityEventName.NewFollowedButton)
  async newFollowedButton(payload: any) {
    const { user, button } = payload.data;
    this.createActivity(button.owner, payload, false);
  }

  findByUserId(
    userId: string,
    locale: string,
    read: boolean = false,
    page,
    eventNameFindOptions = null,
    hydrate = (activity, buttonTypes) => {},
  ): Promise<ActivityDtoOut[]|ActivityMessageDto[]> {
    //@ts-ignore
    return this.networkService
      .findButtonTypes()
      .then((buttonTypes) => {
        
        let findConditions = {
          where: {
            owner: { id: userId },
            eventName: eventNameFindOptions,
            read,
          },
          relations: ['owner'],
          order: { created_at: "DESC" }, 
        }
        if(page || page === 0)
        {
          findConditions = {...findConditions, ...{take: 5,
          skip: page * 5}}
        }
        return this.activityRepository
        //@ts-ignore
        .find(findConditions)
        .then(activities => {return {buttonTypes, activities}})

        })
        .then(({activities, buttonTypes}) => {
            
            return activities.map((activity): ActivityDtoOut|ActivityMessageDto => {
              //@ts-ignore
              return hydrate(activity, buttonTypes)
            })
          });
  }

  private markAllAsRead(userId: string,  eventNameFindOptions) {
    return this.activityRepository.update(
      { read: false, owner: { id: userId }, eventName: eventNameFindOptions, },
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

  createActivity(
    user,
    payload,
    addToDailyMailResume = false,
    read = false,
  ) {
    try {
      console.log(
        `new activity [${user.username}] ${payload.activityEventName} outbox? ${addToDailyMailResume}`,
      );
    } catch (err) {
      console.log(err);
    }
    const activity = {
      id: dbIdGenerator(),
      owner: user,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
      outbox: addToDailyMailResume,
      read,
    };
    return this.activityRepository.insert([activity]);
  }

  private newNetworkActivity(payload) {
    const activity = {
      id: dbIdGenerator(),
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
      homeinfo: true,
    };
    return this.activityRepository.insert([activity]);
  }

  public deleteme(authorId: string) {
    return this.activityRepository.delete({
      owner: { id: authorId },
    });
  }


  public findMessagesByUserId(userId, locale, read, page) : ActivityMessageDto[] {
    //@ts-ignore
    return this.findByUserId(
      userId,
      locale,
      read,
      page,
      In([ActivityEventName.NewPostComment]),
      (activity, buttonTypes) : ActivityMessageDto => {
        if (
          activity.eventName == ActivityEventName.NewPostComment
        ) {
          console.log(activity)
          //@ts-ignore
          const comment = activity.data.comment;
          //@ts-ignore
          const button :Button = comment.post.button
          const authorButton : User = button.owner;
          const excerptSize = 60;
          return {
            image: button.image ? button.image : null, //  (authorButton.avatar ? authorButton.avatar : null)
            //@ts-ignore
            button: {
              type: button.type,
              title: button.title,
              id: button.id
            },
            authorName: comment.author.name,
            privacy: comment.privacy,
            messageExcerpt: `${comment.message.substring(0,excerptSize)}${(comment.message.length > excerptSize) ? '...' : ''}`,
            createdAt: activity.created_at,
            read: activity.read,
            id: activity.id.toString()
          }
        }
      }
    );
  }
  public findNotificationsByUserId(userId, locale, read, page = null) : ActivityDtoOut[] {
    //@ts-ignore
    return this.findByUserId(
      userId,
      locale,
      read,
      page,
      Not(In([ActivityEventName.NewPostComment])),
      (activity, buttonTypes) : ActivityDtoOut => {
        try {
          return transformToMessage(
            activity,
            userId,
            buttonTypes,
            locale,
          );
        } catch (error) {
          console.log(error);
        }
        return {
          id: activity.id,
          eventName: activity.eventName,
          read: activity.read,
          createdAt: 'fail',
          title: 'ops.',
          message: 'ops.',
          image: 'image',
          referenceId: 'ddd',
          isPrivate: false,
          isOwner: false,
        };
      }
    )
  }

  public markAllMessagesAsRead(userId)
  {
    return this.markAllAsRead(userId, In([ActivityEventName.NewPostComment]))
  }

  public markAllNotificationsAsRead(userId)
  {
    return this.markAllAsRead(userId, Not(In([ActivityEventName.NewPostComment])))
  }



  public findNetworkActivity(locale)
  {
    return this.networkService.findButtonTypes()
    .then((buttonTypes) => {

      return this.activityRepository.find({take: 5, order: { created_at: 'DESC' }, where: {homeinfo: true}}).then((activities) => {
        return activities.map((activity): ActivityDtoOut => 
        {
          return transformToMessage(activity, false, buttonTypes, locale)
        })
      })
    })
  }
}
