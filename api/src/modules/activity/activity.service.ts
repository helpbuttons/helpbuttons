import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { uuid } from '@src/shared/helpers/uuid.helper';
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
import { ActivityDtoOut, ActivityMessageDto, ExcerptMaxChars } from './activity.dto';
import { Button } from '../button/button.entity';
import { User } from '../user/user.entity';
import { unique } from '@src/shared/helpers/array.helper';
import { excerpt } from './activity.utils';
import { Comment } from '../post/comment.entity';
import { PostService } from '../post/post.service';
import { getAction } from './activity.types';

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
    private readonly postService: PostService,
  ) {}

  @OnEvent(ActivityEventName.NewPost)
  async onNewPost(payload: any) {
    const post = payload.data.post;
    const button = post.button;
    // check users following the button of this post, and add a new actitivy to the daily outbox
    // console.log(button)
    return this.postService.findByButtonId(button.id)
    .then(async (posts) => {
      if(posts.length <= 1)
      {
        console.log('do not notify, automatic post')
        return Promise.resolve(true)
      }
      return await this.buttonService
      .findById(button.id)
      .then(async (_button) => {
        const usersFollowing =
          await this.userService.findAllByIdsToBeNotified(
            _button.followedBy,
          );

        // notify users following button...
        await Promise.all(
          usersFollowing.map((user) => {
            return this.createActivity(user, payload, true);
          }),
        );

        // notify button owner
        return this.createActivity(_button.owner, payload, false);
      })
      .then(() => {
        return this.newNetworkActivity(payload);
      });
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
    const button = comment.button;

    // notify users mentioned
    let userIdsMentioned = await this.findUserMentionsInMessage(
      message,
      author.username,
    ).then((users) =>
      users.filter((user) => !!user).map((user) => user.id),
    );

    // notify owner of button if different from author
    const userIdsToNotify = unique([
      ...userIdsMentioned,
      author.id,
      button.owner.id,
    ]);
    console.log(userIdsToNotify)
    return Promise.all(
      userIdsToNotify.map((userId) => {
        return this.userService.findById(userId).then((user) => {
          if (user.id == author.id) {
            console.log('author: ' + author.email)
            return user;
          }

          console.log('sending mail to ' +user.email );
          //by Mail
          return this.userService
            .getUserLoginParams(user.id)
            .then((loginParams) => {
              // console.log('sending mail to: ' + user.email);
              // we don't need to wait for the mail to be sent.. so we ignore this promise:
              this.mailService.sendWithLink({
                to: user.email,
                content: translate(
                  user.locale,
                  'activities.newcomment',
                  [author.username, message],
                ),
                subject: translate(
                  user.locale,
                  'activities.newcommentSubject',
                  [button.title],
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

              return user;
            })
            .then((user) => {
              let read = false;
              if (user.id == author.id) {
                read = true;
              }
              if(!user)
              {
                return;
              }
              return this.createActivity(user, payload, false, read);
            });
        });
      }),
    );
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
            .map((tag) => `'${tag.toLowerCase()}' = any(tags)`)
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

  @OnEvent(ActivityEventName.Endorsed)
  @OnEvent(ActivityEventName.RevokeEndorsed)
  @OnEvent(ActivityEventName.RoleUpdate)
  async onEvent(payload: any) {
    const {user, addToDaily} = getAction(ActivityEventName.Endorsed).onEvent(payload)
    this.createActivity(user, payload, addToDaily)
  }

  findByUserId(
    userId: string,
    locale: string,
    read: boolean = null,
    page,
    eventNameFindOptions = null,
    hydrate = (activity, buttonTypes) => {},
  ): Promise<ActivityDtoOut[] | ActivityMessageDto[]> {
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
          order: { created_at: 'DESC' },
        };
        if (page || page === 0) {
          findConditions = {
            ...findConditions,
            ...{ take: 5, skip: page * 5 },
          };
        }
        return (
          this.activityRepository
            //@ts-ignore
            .find(findConditions)
            .then((activities) => {
              return { buttonTypes, activities };
            })
        );
      })
      .then(({ activities, buttonTypes }) => {
        return activities.map(
          (activity): ActivityDtoOut | ActivityMessageDto => {
            //@ts-ignore
            return hydrate(activity, buttonTypes);
          },
        );
      });
  }

  private markAllAsRead(userId: string, eventNameFindOptions) {
    return this.activityRepository.update(
      {
        read: false,
        owner: { id: userId },
        eventName: eventNameFindOptions,
      },
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

    const usernamesMentioned = usernames.map((username) =>
      username.substring(1),
    );
    return Promise.all(
      usernamesMentioned.map((username) => {
        return this.userService.findByUsername(username);
      }),
    ).then((users) => users.filter((user) => user));
  }

  createActivityForUsers(
    users,
    payload,
    addToDailyMailResume = false,
    read = false,
  ) {
    return Promise.all(
      users.map((_user) =>
        this.createActivity(
          _user.id,
          payload,
          addToDailyMailResume,
          read,
        ),
      ),
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
        `new activity ${user.username} ${payload.activityEventName} outbox? ${addToDailyMailResume}`,
      );
    } catch (err) {
      console.log(`${JSON.stringify(user)}`)
      console.log(err);
    }
    const activity = {
      id: uuid(),
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
      id: uuid(),
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



  public findMessagesByUserId(
    userId,
    locale,
    read,
    page,
  ): ActivityMessageDto[] {
    //@ts-ignore
    return this.findByUserId(
      userId,
      locale,
      read,
      page,
      In([ActivityEventName.NewPostComment]),
      (activity, buttonTypes): ActivityMessageDto => {
        if (activity.eventName == ActivityEventName.NewPostComment) {
          //@ts-ignore
          const comment: Comment = activity.data.comment;
          //@ts-ignore
          const button: Button = comment.post.button;
          const authorComment: User = comment.author;
          const excerptMessage = excerpt(comment.message)
          return {
            image: authorComment.avatar ? authorComment.avatar : null, //  (authorButton.avatar ? authorButton.avatar : null)
            //@ts-ignore
            button: {
              type: button.type,
              title: button.title,
              id: button.id,
              image: button.image
            },
            authorName: comment.author.name,
            privacy: comment.privacy,
            message: comment.message,
            createdAt: activity.created_at,
            read: activity.read,
            messageId: comment.id.toString(),
            id: activity.id.toString(),
            excerpt: excerptMessage,
          };
        }
      },
    );
  }
  public findNotificationsByUserId(
    userId,
    locale,
    read,
    page = null,
  ): ActivityDtoOut[] {
    //@ts-ignore
    return this.findByUserId(
      userId,
      locale,
      read,
      page,
      Not(In([ActivityEventName.NewPostComment])),
      (activity, buttonTypes): ActivityDtoOut => {
        return transformToMessage(
          activity,
          userId,
          buttonTypes,
          locale,
        );
      },
    )
    //@ts-ignore
    .then((activities) => activities.filter((activity) => activity))
  }

  public markAllMessagesAsRead(userId) {
    return this.markAllAsRead(
      userId,
      In([ActivityEventName.NewPostComment]),
    );
  }

  public markAllNotificationsAsRead(userId) {
    return this.markAllAsRead(
      userId,
      Not(In([ActivityEventName.NewPostComment])),
    );
  }

  public findNetworkActivity(locale) {
    return this.networkService
      .findButtonTypes()
      .then((buttonTypes) => {
        return this.activityRepository
          .find({
            take: 5,
            order: { created_at: 'DESC' },
            where: { homeinfo: true },
          })
          .then((activities) => {
            return activities.map((activity): ActivityDtoOut => {
              return transformToMessage(
                activity,
                false,
                buttonTypes,
                locale,
              );
            });
          })
          .then((activities) => activities.filter((activity) => activity))
      });
  }
}

