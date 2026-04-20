import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { uuid } from '@src/shared/helpers/uuid.helper';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { EntityManager, Repository } from 'typeorm';
import { Activity } from './activity.entity';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import translate from '@src/shared/helpers/i18n.helper';
import { ButtonService } from '../button/button.service';
import { NetworkService } from '../network/network.service';
import { Activities, ActivitiesPageSize, ActivityDtoOut } from './activity.dto';
import { PostService } from '../post/post.service';
import { unique } from '@src/shared/helpers/array.helper';
import { IsNull } from "typeorm"
import { GroupMessageService } from '../group-message/group-message.service';
import { getUrl } from '@src/shared/helpers/mail.helper';
import { SourceCodeLogger } from '@src/shared/helpers/source-code-logger.helper';

@Injectable()
export class ActivityService {
  private logger = new SourceCodeLogger('Activity')
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
    private readonly groupMessageService: GroupMessageService
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
    if(!button.followedBy){
      console.error('button doesnt have followedBy')
      console.trace()
      return Promise.resolve([])
    }
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
          return this.newActivity(button, _user, button.owner, _user, payload, true, true)
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
        return this.newActivity(button, author, userId, { id: author.id }, payload, true, true, true)
      } else if (userId == author.id) {
        return this.newActivity(button, author, userId, { id: userId }, payload, true, false, true)
      } else {
        return this.newActivity(button, author, userId, { id: userId }, { ...payload, activityEventName: ActivityEventName.NewMention }, true, false, true)
      }
    })
  }

  @OnEvent(ActivityEventName.NewButton)
  async onNewButton(payload: any) {
    const { button } = payload.data

    this.newNetworkActivity(button, button.owner, payload)
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
                return this.newActivity(button, user.id, button.owner.id, { id: user.id },  { data: { button: button }, activityEventName: ActivityEventName.NewButton } , true, false)
            }),
          ).catch((err) => {
            console.log(payload);
            console.log(err);
          });
        }
        // return this.createActivity(button.owner, payload, false);
      })
  }

  @OnEvent(ActivityEventName.RenewButton)
  async onRenewButton(payload: any) {
    const { button, owner } = payload.data;
    return this.findUsersToNotify(button)
      .then((users) => {
        if (users.length < 1) {
          this.newActivity(button, owner, owner, { id: owner.id }, payload, false, true, false)
          return;
        }
        return users.map((_user, idx) => {
          return this.newActivity(button, _user, owner, _user, payload, true, true)
        })
      })
  }
  @OnEvent(ActivityEventName.ExpiredButton)
  async onExpiredButton(payload: any) {
    const { button } = payload.data;
    return this.findUsersToNotify(button)
      .then((users) => {
        return users.map((_user) => {
          return this.newActivity(button, _user, button.ownerId, _user, payload)
        })
      })
  }

  @OnEvent(ActivityEventName.SchedulerExpiredButton)
  async onSchedulerExpired(payload: any)
  {
    const { button } = payload.data;

    return this.findUsersToNotify(button)
      .then((users) => {
        if(users.length < 1){
          this.newActivity(button, button.ownerId,  button.ownerId ,{id: button.ownerId}, payload, false, true, true)
          return;
        }
        this.newActivity(button, button.ownerId,  button.ownerId ,{id: button.ownerId}, payload, false, false, true)
        return users.map((_user, idx) => {
          return this.newActivity(button, _user, button.ownerId, _user, payload, true, true)
        })
      })
  }

  @OnEvent(ActivityEventName.EndorseRevoked)
  async onEndorseRevoked(payload: any) {
    const { user } = payload.data;
    return this.activityRepository.delete({
      consumer: { id: user.id },
      eventName: ActivityEventName.Endorsed,
    })
  }

  @OnEvent(ActivityEventName.Endorsed)
  @OnEvent(ActivityEventName.RoleUpdate)
  async onRoleUpdated(payload: any) {
    const { user, sessionUser } = payload.data;
    this.newActivity(null, user.id, sessionUser, { id: user.id }, payload, false, false)
  }

  public sendMessage(fromId, consumerId, buttonId, message) {
    return this.buttonService.findById(buttonId)
      .then((button) => {
        let toId = consumerId
        if (consumerId == fromId) {
          toId = button.owner.id
        }
        return this.newActivity({ id: buttonId }, { id: toId }, { id: fromId }, { id: consumerId }, { data: { message: message }, activityEventName: ActivityEventName.Message }, true, true, true)
      })
  }

  private async notifyByEmail(insertResult) {
    const activityId = insertResult.identifiers[0].id
    console.log('should send mail....')
    const network = await this.networkService.findDefaultNetwork()
    const btnTypes = await this.networkService.findButtonTypes()

    return this.activityRepository.findOne({ where: { id: activityId }, relations: ['button.owner', 'to', 'from', 'consumer'] })
      .then((activity) => {
        const toId = activity.to.id;
        return this.userService.findById(toId)
          .then((user) => {
            const _activity = this.transformActivity(activity, user.locale, toId);
            const isButtonOwner = activity?.button?.owner?.id == toId
            const fromName: string = activity?.from?.name;
            const publicationTitle: string = activity.button.title
            const locale = activity.to.locale
            return this.userService.getUserLoginParams(toId)
              .then((loginParams) => {
                const btnType = btnTypes.find((btnType) => btnType.name == activity.button.type)
                const btnTypeCaption = `${btnType.icon} ${btnType?.caption}`
                const extra = {
                  title: activity.button.title,
                  address: activity.button.address,
                  type: btnTypeCaption,
                  networkName: network.name
                }
                switch(activity.eventName){
                  case ActivityEventName.Message:
                    this.mailService.sendActivity({
                      to: activity.to.email,
                      content: translate(locale, 'activities.newMessageContent', [fromName, _activity.message]),
                      subject: translate(locale, 'activities.newMessageSubject', [fromName]),
                      link: this.addLoginParams(getUrl(`/Activity/button/${_activity.buttonId}`), loginParams),
                      linkCaption: translate(locale, 'activities.replyToMessage'),
                      ...extra
                    });
                    break;
                  case ActivityEventName.NewPostComment:
                    this.mailService.sendWithLink({
                      to: activity.to.email,
                      content: translate(locale, 'activities.newPostCommentContent', [fromName, _activity.message, publicationTitle]),
                      subject: translate(locale, 'activities.newPostCommentSubject', [fromName]),
                      link: this.addLoginParams(getUrl(`/Activity/button/${_activity.buttonId}`), loginParams),
                      linkCaption: translate(locale, 'activities.replyToMessage'),
                      ...extra
                    })
                    break;
                  case ActivityEventName.NewMention:
                    this.mailService.sendWithLink({
                      to: activity.to.email,
                      content: translate(locale, 'activities.newMentionContent', [fromName, _activity.message, publicationTitle]),
                      subject: translate(locale, 'activities.newMentionSubject', [fromName]),
                      link: this.addLoginParams(getUrl(`/Activity/button/${_activity.buttonId}`), loginParams),
                      linkCaption: translate(locale, 'activities.replyToMessage'),
                      ...extra
                    })
                    break;
                  case ActivityEventName.SchedulerExpiredButton:
                    this.mailService.sendWithLink({
                      to: activity.to.email,
                      content: translate(locale, 'customTemplates.schedulerExpired'),
                      subject: translate(locale, 'customTemplates.schedulerExpiredMailSubject'),
                      link: this.addLoginParams(getUrl(`/Activity/button/${_activity.buttonId}`), loginParams),
                      linkCaption: translate(locale, 'activities.view'), 
                    });
                    break;
                }
              })

          })
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

  async newActivity(button, to, from, consumer, payload, setAsLastButtonConsumer = true, setAsLastButtonOwner = false, notifyToEmail = false) {
    const activity = {
      id: uuid(),
      button,
      to,
      from,
      consumer,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
      outbox: !notifyToEmail,// if doesn't notify, will be sent on resume to mail
      lastActivityButtonConsumer: setAsLastButtonConsumer,
      lastActivityButtonOwner: setAsLastButtonOwner,
    };
       
    if(!from){
      this.logger.warn(payload.activityEventName)
      this.logger.warn(from)
      console.trace()
      return;
    }
    if (setAsLastButtonConsumer) {
      await this.hideActivitiesButtonConsumer(button.id, consumer.id)
    }
    if (setAsLastButtonOwner) {
      await this.hideActivitiesButtonOwner(button.id, consumer.id)
    }

    
    return this.activityRepository.insert([activity])
    .then((insertResult) => {
      if(notifyToEmail) {
        this.notifyByEmail(insertResult)
      }
      return insertResult
    })
  }


  private newNetworkActivity(button, from, payload) {
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
    return this.activityRepository.insert([activity]);
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
        return activities.filter((activity) => {
          const isButtonOwner = activity?.button?.owner?.id == userId
          const isConsumer = userId == consumerId
          if (!isConsumer && !isButtonOwner) {
            return false;
          }
          return true;
        })
      })
      .then((activities) => {
        return activities.map((activity) => {
          return this.transformActivity(activity, locale, userId);
        })
      })
  }

  public findNotificationsByUser(
    user,
    page = 0,
  ): Promise<Activities> {

    return this.activityRepository.find({
      where: [
        { consumer: { id: user.id }, lastActivityButtonConsumer: true },
        { button: { owner: { id: user.id } }, lastActivityButtonOwner: true },
        { consumer: { id: user.id }, button: IsNull() }
      ],
      relations: ['button.owner', 'to', 'from', 'consumer'],
      take: ActivitiesPageSize, skip: page * ActivitiesPageSize,
      order: { created_at: 'DESC' },
    })
      .then((activities) => {
        return activities.map((activity) => {
          return this.transformActivity(activity, user.locale, user.id);
        })
      }).then((activities) => {
        return this.groupMessageService.findByUser(user)
          .then((groupMessages) => {
            return {
              buttons: activities,
              ...groupMessages
            }
          })
      })
  }

  transformActivityHomeInfo(activity, locale, userId) {
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
          const { button } = activity.data
          return {
            ...activityOut,
            title: button.title,
            from: button.owner.name,
            image: button.image,
            buttonType: button.type,
            type: translate(locale, 'activities.notice'),
            footer: button.address,
            message: translate(locale, 'activities.newbuttonHomeinfo'),
          }
        }
      case ActivityEventName.NewPost:
        {
          const { post } = activity.data
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
          }
        }
    }
  }
  
  public transformActivity(activity, locale, userId) {
    try {
      const isOwner = activity?.to?.id == userId;
      const isButtonOwner = activity?.button?.owner?.id == userId
      const disableChat = (userId == activity?.button?.owner.id && activity?.consumer?.id == userId) ? true : false;
      const read = (activity?.from?.id == userId) ? true : activity.read;
      if (activity.from == null) {
        console.log(activity)
        this.logger.warn(`activity as from null: ${activity.eventName} ${activity.id}`)
      }
      let activityOut = {
        id: activity.id,
        eventName: activity.eventName,
        read: read,
        createdAt: activity.created_at,
        buttonId: activity?.button?.id,
        fromId: activity?.from?.id,
        consumerId: activity?.consumer?.id,
        activityFrom: isButtonOwner ? activity.consumer : activity?.button?.owner,
        disableChat: disableChat,
        link: getUrl('/Explore'),
        linkCaption: translate(locale, 'activities.view')
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
            link: getUrl(`/Show/${activity.button.id}`)
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
            link: getUrl(`/Show/${activity.button.id}`)
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
            link: null,
            disableChat: true,
          }
        case ActivityEventName.Message:
          {
            const { message } = activity.data
            return {
              ...activityOut,
              title: isOwner ? activity.from.name : activity.to.name,
              from: isOwner ? activity.from.name : '',
              image: isOwner ? activity.from.avatar : activity.button.image,
              buttonType: activity.button.type,
              type: translate(locale, 'activities.message'),
              footer: `${activity.button.title} - ${activity.button.address}`,
              message: message,
              link: getUrl(`/Activity/${activity.id}`)
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
              type: translate(locale, 'activities.comment'),
              footer: `${activity.button.title} - ${activity.button.address}`,
              message: commentOwner ? translate(locale, 'activities.newcommentOwn', [comment.message]) : translate(locale, 'activities.newcomment', [comment.author.name, comment.message]),
              messageId: comment.id,
              link: getUrl(`/Show/${activity.button.id}`)
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
              messageId: comment.id,
              link: getUrl(`/Show/${activity.button.id}`)
            }
          }
        case ActivityEventName.NewButton:
          {
            const { button } = activity.data
            let message = translate(locale, 'activities.newButtonInterest', [button.address])
            if(isButtonOwner)
            {
              message = translate(locale, 'activities.newbutton', [button.address])
            }
            return {
              ...activityOut,
              title: button.title,
              from: button.owner.name,
              image: button.image,
              buttonType: button.type,
              type: translate(locale, 'activities.notice'),
              footer: button.address,
              message: message,
              link: getUrl(`/Show/${activity.button.id}`)
            }
          }
        case ActivityEventName.Endorsed:
          {
            return {
              ...activityOut,
              title: "",
              from: "",
              image: "",
              buttonType: "",
              type: translate(locale, 'activities.notice'),
              footer: "",
              message: translate(locale, 'activities.endorsed'),
              link: null
            }
          }
        case ActivityEventName.RoleUpdate:
          {
            const { role } = activity.data
            return {
              ...activityOut,
              title: "",
              from: "",
              image: "",
              buttonType: "",
              type: translate(locale, 'activities.notice'),
              footer: "",
              message: translate(locale, 'activities.roleupdate', [role]),
              link: null
            }
          }
        case ActivityEventName.RenewButton:
          return {
            ...activityOut,
            title: activity?.from?.name,
            from: "",
            image: activity.button.image,
            buttonType: activity.button.type,
            type: translate(locale, 'activities.notice'),
            footer: `${activity.button.title} - ${activity.button.address}`,
            message: translate(locale, 'customTemplates.schedulerRenewd'),
            link: null,
            disableChat: false,
          }
        case ActivityEventName.SchedulerExpiredButton:
          return {
            ...activityOut,
            title: activity?.from?.name,
            from: "",
            image: activity.button.image,
            buttonType: activity.button.type,
            type: translate(locale, 'activities.notice'),
            footer: `${activity.button.title} - ${activity.button.address}`,
            message: translate(locale, 'customTemplates.schedulerExpired'),
            link: null,
            disableChat: false,
          }
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
    } catch (err) {
      // console.log(activity)
      console.log(activity.id)
      console.log(err)
    }
    return {
        id: activity.id,
        eventName: activity.eventName,
        read: false,
        createdAt: activity.created_at,
        buttonId: activity?.button?.id,
        fromId: activity?.from?.id,
        consumerId: activity.consumer.id,
        activityFrom: false,
        disableChat: true,
        link: getUrl('/Explore'),
        linkCaption: 'errror',
        title: "",
        from: "",
        image: "",
        buttonType: "",
        type: "",
        footer: "",
        message: activity.eventName
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
              try {
                return this.transformActivityHomeInfo(activity, locale, false)
              } catch (err) {
                console.log(activity)
                console.log(err)
              }
            });
          })
      });
  }

  @OnEvent(ActivityEventName.NotifyAdmins)
  public notifyAdmins(payload: any) {
    this.userService.findAdministrators()
      .then((admins) => {
        // console.log(admins)
        admins.map((admin) => {
          // this.createActivity(admin, payload, false);
        })
      })

  }

  public addLoginParams(link, loginParams){
    if(!link)
    {
      return null
    }
    
    return  `${link}${loginParams}`
  }
}