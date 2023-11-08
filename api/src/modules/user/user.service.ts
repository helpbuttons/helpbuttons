import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Role } from '@src/shared/types/roles';
import { removeUndefined } from '@src/shared/helpers/removeUndefined';
import { MailService } from '../mail/mail.service';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { OnEvent } from '@nestjs/event-emitter';
import translate from '@src/shared/helpers/i18n.helper';
import { configFileName } from '@src/shared/helpers/config-name.const';
import { getUrl } from '@src/shared/helpers/mail.helper';
const config = require(`../../..${configFileName}`);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createUser(user: User) {
    return this.userRepository.insert([user]);
  }

  async isEmailExists(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    return user ? true : false;
  }

  async findById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async userCount() {
    return await this.userRepository.count();
  }
  async findAdministrator() {
    // returning only the first admin
    return await this.userRepository.findOne({
      where: { role: Role.admin },
      order: { id: 'DESC' },
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: `${email}` },
    });
  }

  async findByUsername(username: string, includeCounts = false) {
    return await this.userRepository.findOne({
      where: { username: `${username}` },
    }).then(async (user) => {
      if(includeCounts)
      {
        const buttonCount = await this.entityManager.query(`select count(button.id) as "buttonsCount" from button where "ownerId" = '${user.id}'`);
        const postCount = await this.entityManager.query(`select count(post.id) as "postsCount" from post where "authorId" = '${user.id}'`);
        const commentCount = await this.entityManager.query(`select count(comment.id) as "commentsCount" from comment where "authorId" = '${user.id}'`);
        return {...user, postCount: postCount[0].postsCount, commentCount: commentCount[0].commentsCount, buttonCount: buttonCount[0].buttonsCount}
      }
      return user;
    });
  }

  async update(userId: string, newUser) {
    return this.userRepository.update(
      userId,
      removeUndefined(newUser),
    );
  }

  loginToken(verificationToken: string) {
    if(verificationToken.length < 2)
    {
      throw new HttpException('token not found', HttpStatus.UNAUTHORIZED)
    }
    return this.userRepository
      .findOne({
        where: { verificationToken: `${verificationToken}` },
      })
      .then((user: User) => {
        if(!user) {
          throw new HttpException('token not found', HttpStatus.UNAUTHORIZED)
        }
        return this.userRepository
          .update(user.id, {
            ...removeUndefined(user),
            verificationToken: '',
            emailVerified: true,
          })
          .then(() => {
            return user;
          });
      });
  }

  @OnEvent(ActivityEventName.NewPostComment)
  async mailOwner(payload: any) {
    const message = payload.data.message;
    const author = payload.data.author.username;

    const activity = {
      owner: payload.destination,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data),
    };

    // get users...
    var userPattern = /@[\w]+/gi;
    let userNames = message.match(userPattern);

    if(!userNames)
    {
      return;
    }
    userNames = userNames.filter(
      (username) => username.substring(1) != author,
    );
    // get user language
    let users = await Promise.all(
      userNames.map(async (_username) => {
        const username = _username.substring(1);
        return await this.findByUsername(username);
      }),
    );
    users = users.filter((user) => user?.receiveNotifications)
    users.map((user) => {
      this.mailService.sendWithLink( { 
        content: translate(
          user.locale,
          'activities.newcomment',
          [payload.data.message, payload.data.button.title, payload.data.author.username],
        ),
        to: user.email,
        link: getUrl(user.locale,`/ButtonFile/${payload.data.button.id}`),
        linkCaption: translate(user.locale, 'email.buttonLinkCaption'), 
        subject: translate(user.locale, 'email.activitySubject')
      })
    });
  }


  @OnEvent(ActivityEventName.NewPost)
  async notifyFollowers(payload: any) {
    const buttonFollowers = payload.data.button.followedBy;
    if(buttonFollowers.length < 1)
    {
      return;
    }

    const users = await this.userRepository
    .createQueryBuilder('user')
    .select('email,locale')
    .where(
      `id IN (:...buttonFollowers) AND "receiveNotifications" = true `,
      { buttonFollowers: buttonFollowers },
    )
    .limit(1000)
    .execute();

    
    users.map((user) => {
      this.mailService.sendWithLink( { 
        content: translate(
          user.locale,
          'activities.newpost',
          [payload.data.message, payload.data.button.title, payload.data.author.username],
        ),
        to: user.email,
        link: getUrl(user.locale,`/ButtonFile/${payload.data.button.id}`),
        linkCaption: translate(user.locale, 'email.buttonLinkCaption'), 
        subject: translate(user.locale, 'email.activitySubject')
      })
    });
  }

  updateRole(userId, newRole)
  {
    return this.userRepository.update(userId, {role: newRole})
  }

  async moderationList()
  {
    return {
      administrators: await this.userRepository.find({where: {role: Role.admin}}),
      blocked: await this.userRepository.find({where: {role: Role.blocked}}),
    } 
  }

  async unsubscribe(email)
  {
    const user = await this.findOneByEmail(email)
    if(user)
    {
      await this.userRepository.update(user.id, {receiveNotifications: false})
    }
    return true;
  }
}
