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
import { ButtonService } from '../button/button.service';
import { NetworkService } from '../network/network.service';
import { ActivitiesPageSize, ActivityDtoOut } from './activity.dto';
import { PostService } from '../post/post.service';
import { unique } from '@src/shared/helpers/array.helper';
import { IsNull } from "typeorm"

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
  ) { }

  @OnEvent(ActivityEventName.NewPost)
  async onNewPost(payload: any) {
    const post = payload.data.post;
    const button = post.button;
    const author = post.author;
    // check users following the button of this post, and add a new actitivy to the daily outbox
    return this.postService.findByButtonId(button.id)
      .then(async (posts) => {
        if (posts.length <= 1) {
          // do not notify, automatic post
          return Promise.resolve(true)
        }
        return this.findUsersToNotify(button)
          .then((users) => {
            return users.map((_user) => {
              return this.newActivity(button, _user, author, _user, payload)
            })
          })
          .then(() => {
            return this.newNetworkActivity(button, author, payload);
          });
      })

  }

  findUsersToNotify(button) {
    return this.userService.findAllByIdsToBeNotified(button.followedBy);
  }

  @OnEvent(ActivityEventName.NewFollowingButton)
  async newFollowingButton(payload: any) {
    const { user, button } = payload.data;
    return this.activityRepository.delete({
      consumer: { id: user.id },
      button: { id: button.id },
      eventName: ActivityEventName.NewFollowingButton,
    })
      .then(() => this.newActivity(button, button.owner, user, user, payload, true, true))
  }

  @OnEvent(ActivityEventName.UnfollowButton)
  async unfollowButton(payload: any) {
    const { user, button } = payload.data;
    return this.activityRepository.delete({
      consumer: { id: user.id },
      button: { id: button.id },
      eventName: ActivityEventName.NewFollowingButton,
    })
  }

  @OnEvent(ActivityEventName.DeleteButton)
  async onDeleteButton(payload: any) {
    const { user, button } = payload.data

    return this.findUsersToNotify(button)
      .then((users) => {
        return users.map((_user) => {
          return this.newActivity(button, _user, button.owner, _user, payload)
        })
      })
  }

  @OnEvent(ActivityEventName.NewPostComment)
  async onNewPostComment(payload: any) {


    // notify owner of button
    // author

    // notify
    // - dont send mail to author of comment
    // - send mail to owner of button if owner is not author
    // - notify users mentioned on comment
    const comment = payload.data.comment;
    const message = comment.message;
    const author = comment.author;
    const button = comment.button;
    let usersMentioned = await this.findUserMentionsInMessage(
      message,
      author.username,
    )

    let userIdsMentioned = usersMentioned.map((user) => user.id);
    if (button.owner.id != author.id) {
      userIdsMentioned = [...userIdsMentioned, button.owner.id];
    }
    userIdsMentioned = unique(userIdsMentioned);

    userIdsMentioned.map((userId) => {
      if (userId == button.owner.id) {
        return this.newActivity(button, author, userId, { id: author.id }, payload, true, true)
      } else if(userId == author.id){
        return this.newActivity(button, author, userId, { id: userId }, payload, true, false)
      }else{
        return this.newActivity(button, author, userId, { id: userId }, { ...payload, activityEventName: ActivityEventName.NewMention}, true, false)
      }
    })
  }

  @OnEvent(ActivityEventName.NewButton)
  async onNewButton(payload: any) {
    // const button_ = getButtonActivity(payload.data);
    console.log('TODO not working, needs refator')
    const {button} = payload.data
    
    return this.newNetworkActivity(button, button.owner, payload)
    return ;
    const _button = payload.data.button
    // check users following the button of this post, and add a new actitivy to the daily outbox
    return this.buttonService
      .findById(_button.id)
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
                  return this.newActivity(button, user.id, button.owner.id, { id: user.id }, true, false)
                  // return this.createActivity(user, payload, true);
                });
            }),
          ).catch((err) => {
            console.log(payload);
            console.log(err);
          });
        }
        // return this.createActivity(button.owner, payload, false);
      })
      .then(() => {
        // return this.newNetworkActivity(payload);
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
    // await this.createActivity(button.owner, payload, false);
    console.log('TODO')

  }

  @OnEvent(ActivityEventName.EndorseRevoked)
  async onEndorseRevoked(payload: any){
    const { user } = payload.data;
    return this.activityRepository.delete({
      consumer: { id: user.id },
      eventName: ActivityEventName.Endorsed,
    })
  }

  @OnEvent(ActivityEventName.Endorsed)
  @OnEvent(ActivityEventName.RoleUpdate)
  async onRoleUpdated(payload: any) {
    const { user } = payload.data;
    this.newActivity(null, user.id, null, { id: user.id }, payload, false, false)
  }

  public sendMessage(fromId, consumerId, buttonId, message) {
    return this.buttonService.findById(buttonId)
      .then((button) => {
        let toId = consumerId
        if (consumerId == fromId) {
          toId = button.owner.id
        }
        return this.newActivity({ id: buttonId }, { id: toId }, { id: fromId }, { id: consumerId }, { data: { message: message }, activityEventName: ActivityEventName.Message }, true, true)
      })
  }

  private markAllAsRead(userId: string, eventNameFindOptions) {
    return this.activityRepository.update(
      {
        read: false,
        to: { id: userId },
        eventName: eventNameFindOptions,
      },
      { read: true },
    );
  }

  markAsRead(userId: string, activityId: string) {
    return this.activityRepository.update(
      { id: activityId, to: { id: userId } },
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

  async hideActivitiesButtonConsumer(buttonId, consumerId) {
    return await this.activityRepository.update(
      {
        button: { id: buttonId },
        consumer: { id: consumerId },
      },
      { lastActivityButtonConsumer: false },
    )
  }

  async hideActivitiesButtonOwner(buttonId, consumerId) {
    return await this.activityRepository.update(
      {
        button: { id: buttonId },
        consumer: { id: consumerId },
      },
      { lastActivityButtonOwner: false },
    )
  }
  async newActivity(button, to, from, consumer, payload, setAsLastButtonConsumer = true, setAsLastButtonOwner = false) {
    const activity = {
      id: uuid(),
      button,
      to,
      from,
      consumer,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
      outbox: false,
      lastActivityButtonConsumer: setAsLastButtonConsumer,
      lastActivityButtonOwner: setAsLastButtonOwner,
    };

    if (setAsLastButtonConsumer) {
      await this.hideActivitiesButtonConsumer(button.id, consumer.id)
    }
    if (setAsLastButtonOwner) {
      await this.hideActivitiesButtonOwner(button.id, consumer.id)
    }
    return this.activityRepository.insert([activity]);
  }


  async newNetworkActivity(button, from, payload) {
    const activity = {
      id: uuid(),
      button,
      from,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
      outbox: false,
      lastActivityButtonConsumer: false,
      lastActivityButtonOwner: false,
      homeinfo: true,
    };
    return (await this.activityRepository.insert([activity]));
  }

  public deleteme(authorId: string) {
    return this.activityRepository.delete({
      to: { id: authorId },
    });
  }

  public findNotificationByButtonAndUser(userId, buttonId, consumerId, locale, page): Promise<ActivityDtoOut[]> {

    return this.activityRepository.find({
      where:
        { button: { id: buttonId }, consumer: { id: consumerId } },
      relations: ['button.owner', 'to', 'from', 'consumer'],
      take: ActivitiesPageSize, skip: page * ActivitiesPageSize,
      order: { created_at: 'DESC' },
    })
      .then((activities) => {
        return activities.map((activity) => {
          return this.transformActivity(activity, locale, userId);
        })
      })
  }

  public findNotificationsByUserId(
    userId,
    locale,
    page = null,
  ): Promise<ActivityDtoOut[]> {

    return this.activityRepository.find({
      where: [
        { consumer: { id: userId }, lastActivityButtonConsumer: true },
        { button: { owner: { id: userId } }, lastActivityButtonOwner: true },
        {consumer: {id: userId}, button: IsNull()}
      ],
      relations: ['button.owner', 'to', 'from', 'consumer'],
      take: ActivitiesPageSize, skip: page * ActivitiesPageSize,
      order: { created_at: 'DESC' },
    })
      .then((activities) => {
        return activities.map((activity) => {
          return this.transformActivity(activity, locale, userId);
        })
      })
  }

  transformActivityHomeInfo(activity, locale,userId) {
    let activityOut = {
      id: activity.id,
      eventName: activity.eventName,
      read: true,
      createdAt: activity.created_at,
      buttonId: activity?.button?.id,
      fromId: activity?.from?.id,
      consumerId: activity?.consumer?.id,
      activityFrom: activity?.button?.owner,
      disableChat: true 
    }
    
    switch (activity.eventName) {
    case ActivityEventName.NewButton:
        {
          const {button} = activity.data
          return {
          ...activityOut,
          title: button.title,
          from: button.owner.name,
          image: button.image,
          buttonType: button.type,
          type: translate(locale, 'activities.notice'),
          footer: button.address,
          message: translate(locale, 'activities.newbuttonHomeinfo'),
        }}
        case ActivityEventName.NewPost:
        {
          const {post} = activity.data
          return {
          ...activityOut,
          title: activity.from.name,
          from: "",
          image: activity.button.image,
          buttonType: activity.button.type,
          type: translate(locale, 'activities.notice'),
          footer: `${activity.button.title} - ${activity.button.address}`,
          message: translate(locale, 'activities.newpost', [post.message]),
          postId: post.id,
        }}
      }
  }

  transformActivity(activity, locale,userId) {
    try{
    const isOwner = activity.to.id == userId;
    const isButtonOwner = activity?.button?.owner?.id == userId
    const disableChat = (activity?.button && (activity.to.id == activity.button.owner.id || activity.from.id == activity.button.owner.id)) ? false : true;
    const read = (activity.from.id == userId) ? true : activity.read;
    let activityOut = {
      id: activity.id,
      eventName: activity.eventName,
      read: read,
      createdAt: activity.created_at,
      buttonId: activity?.button?.id,
      fromId: activity?.from?.id,
      consumerId: activity.consumer.id,
      activityFrom: isButtonOwner ? activity.consumer : activity?.button?.owner,
      disableChat: disableChat 
    }

    switch (activity.eventName) {
      case ActivityEventName.NewFollowingButton:
        
        return {
          ...activityOut,
          title: isButtonOwner ? activity.from.name : activity.button.owner.name,
          from: "",
          image: isOwner ? activity.from.avatar : activity.button.image,
          buttonType: activity.button.type,
          type: translate(locale, 'activities.notice'),
          footer: `${activity.button.title} - ${activity.button.address}`,
          message: isOwner ? translate(locale, 'activities.newfollowed') : translate(locale, 'activities.newfollowing'),
        }
      case ActivityEventName.NewPost:
        const { post } = activity.data
        return {
          ...activityOut,
          title: activity.from.name,
          from: "",
          image: isOwner ? activity.from.avatar : activity.button.image,
          buttonType: activity.button.type,
          type: translate(locale, 'activities.notice'),
          footer: `${activity.button.title} - ${activity.button.address}`,
          message: translate(locale, 'activities.newpost', [post.message]),
          postId: post.id,
          // https://dev.helpbuttons.org/Show/a05c07a8797c4b5bb0487e3eafe93d21a2b5
        }
      case ActivityEventName.DeleteButton:
        return {
          ...activityOut,
          title: activity.from.name,
          from: "",
          image: isOwner ? activity.from.avatar : activity.button.image,
          buttonType: activity.button.type,
          type: translate(locale, 'activities.notice'),
          footer: `${activity.button.title} - ${activity.button.address}`,
          message: translate(locale, 'activities.deleted'),
        }
      case ActivityEventName.Message:
        {
          const { message } = activity.data
          console.log(activity)
          return {
            ...activityOut,
            title: isOwner ? activity.from.name : activity.to.name,
            from: isOwner ? activity.from.name : '',
            image: isOwner ? activity.from.avatar : activity.button.image,
            buttonType: activity.button.type,
            type: translate(locale, 'activities.notice'),
            footer: `${activity.button.title} - ${activity.button.address}`,
            message: message,
          }
        }
      case ActivityEventName.NewPostComment:
        {
          const { comment } = activity.data
          const commentOwner = comment.author.id == userId

          return {
            ...activityOut,
            title: isOwner ? activity.from.name : activity.to.name,
            from: isOwner ? activity.from.name : '',
            image: isOwner ? activity.from.avatar : activity.button.image,
            buttonType: activity.button.type,
            type: translate(locale, 'activities.notice'),
            footer: `${activity.button.title} - ${activity.button.address}`,
            message: commentOwner ? translate(locale, 'activities.newcommentOwn', [comment.message]) : translate(locale, 'activities.newcomment', [comment.author.name, comment.message]),
            messageId: comment.id,
          }
        }
      case ActivityEventName.NewMention:
        {
          const { comment } = activity.data
          const commentOwner = comment.author.id == userId

          return {
            ...activityOut,
            title: '',
            from: isOwner ? activity.from.name : '',
            image: isOwner ? activity.from.avatar : activity.button.image,
            buttonType: activity.button.type,
            type: translate(locale, 'activities.notice'),
            footer: `${activity.button.title} - ${activity.button.address}`,
            message: commentOwner ? translate(locale, 'activities.newmentionOwn', [comment.message]) : 
            translate(locale, 'activities.newmention', [comment.author.name, comment.message]),
            messageId: comment.id
          }
        }
      case ActivityEventName.NewButton:
        {
          const {button} = activity.data
          return {
          ...activityOut,
          title: button.title,
          from: button.owner.name,
          image: button.image,
          buttonType: button.type,
          type: translate(locale, 'activities.notice'),
          footer: button.address,
          message: translate(locale, 'activities.endorsed'),
        }}
      case ActivityEventName.Endorsed: 
      {return {
          ...activityOut,
          title: "",
          from: "",
          image: "",
          buttonType: "",
          type: translate(locale, 'activities.notice'),
          footer: "",
          message: translate(locale, 'activities.endorsed'),
        }}
      default:
        return {
          ...activityOut,
          title: "",
          from: "",
          image: "",
          buttonType: "",
          type: "",
          footer: "",
          message: activity.eventName
        }
    }
  }catch(err) {
    console.log(err)
  }
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
            relations: ['button.owner', 'to', 'from', 'consumer'],
          })
          .then((activities) => {
            return activities.map((activity): ActivityDtoOut => {
              try{
              return this.transformActivityHomeInfo(activity, locale, false)
              }catch(err){
                console.log(activity)
                console.log(err)
              }
            });
          })
          // .then((activities) => activities.filter((activity) => activity))
      });
  }

  @OnEvent(ActivityEventName.NotifyAdmins)
  public notifyAdmins(payload: any) {
    this.userService.findAdministrators()
      .then((admins) => {
        console.log(admins)
        admins.map((admin) => {
          // this.createActivity(admin, payload, false);
        })
      })

  }
}