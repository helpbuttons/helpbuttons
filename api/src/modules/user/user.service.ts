import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from './user.entity';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { Role } from '@src/shared/types/roles';
import { removeUndefined } from '@src/shared/helpers/removeUndefined';
import { TagService } from '../tag/tag.service';
import { token } from '@src/shared/helpers/uuid.helper';
import { plainToClass } from 'class-transformer';
import { StorageService } from '../storage/storage.service';
import { MailService } from '../mail/mail.service';
import { GroupMessageType } from '@src/shared/types/group-message.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly tagService: TagService,
    private readonly storageService: StorageService,
    private readonly mailService: MailService
  ) { }

  createUser(user: User) {
    const _user = this.userRepository.create(user);
    return this.userRepository.save(_user)
  }

  isEmailExists(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    }).catch(() => false)
  }

  findById(id: string, includeCounts = false) {
    return this.userRepository.findOne({ where: { id } })
      .then((user) => {
        if (includeCounts) {
          return this.findCounts(user)
        }
        return user;
      });

  }

  userCount() {
    return this.userRepository.count();
  }

  findAdministrators() {
    return this.userRepository
      .find({
        where: { role: Role.admin },
        order: { id: 'DESC' },
      })
      .then(
        (admins) =>
          admins.map((admin) => {
            const adminFields = plainToClass(User, admin, {
              excludeExtraneousValues: true,
            });
            return { ...adminFields, hasPhone: admin.publishPhone };
          }),
      );
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email: `${email}` },
    });
  }
  async findCounts(user) {
    const q = `SELECT COALESCE(
        (select sum(cardinality("followedBy")) as "followsCount" from button where "ownerId"= $1), 
      0) as "followersCount",
      COALESCE(
        (select count(button.id) as "buttonsCount" from button where "ownerId" = $1),0) as "buttonCount",
        COALESCE(
        (select count(post.id) as "postsCount" from post where "authorId" = $1),0) as "postCount",
COALESCE(
        (select count(comment.id) as "commentsCount" from comment where "authorId" = $1),0) as "commentCount"
        `;
    return this.entityManager.query(
      q, [user.id]
    ).then((results) => {
      const result = results[0]
      return {
        ...user,
        followsCount: parseInt(result.followersCount),
        postsCount: parseInt(result.postCount),
        commentCount: parseInt(result.commentCount) + parseInt(result.postCount),
        buttonCount: parseInt(result.buttonCount),
      };
    });
  }
  findByUsername(username: string, includeCounts = false) {
    return this.userRepository
      .findOne({
        where: { username: `${username}` },
      })
      .then((user) => {
        if (includeCounts) {
          return this.findCounts(user)
        }
        return user;
      })
  }

  update(userId: string, newUser) {
    if (newUser.center?.coordinates) {
      this.entityManager.query(
        `update public.user set center = ST_Point($1, $2, 4326) ::geography where id = $3`,[newUser.center.coordinates[1], newUser.center.coordinates[0], userId]
      );
    }

    delete newUser.center;
    if(!newUser.email)
    {
      newUser.email = null
    }
    newUser.hasPhone = newUser.phone ? true : false
    
    return this.userRepository.update(userId, {
      ...newUser,
      tags: this.tagService.formatTags(newUser.tags),
    });
  }

  notifyMail(userId, content, subject, link, linkCaption) {
    return this.userRepository.findOneBy({ id: userId })
      .then((user) => {
        this.mailService.sendWithLink({
          to: user.email,
          content,
          subject,
          link,
          linkCaption,
        });
      })
      ;

  }

  loginToken(verificationToken: string) {
    if (verificationToken.length < 2) {
      throw new HttpException(
        'token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.userRepository
      .findOne({
        where: { verificationToken: `${verificationToken}` },
      })
      .then((user: User) => {
        if (!user) {
          throw new HttpException(
            'token not found',
            HttpStatus.UNAUTHORIZED,
          );
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

  updateRole(userId, newRole) {
    return this.userRepository.update(userId, { role: newRole }).then(() => {
      return this.findById(userId)
    })
  }

  moderationList(user: User, page: number) {
    return this.userRepository.find({ take: 10, skip: page * 10, order: { name: 'ASC' }})
  }

  async unsubscribe(email) {
    const user = await this.findOneByEmail(email);
    if (user) {
      await this.userRepository.update(user.id, {
        receiveNotifications: false,
      });
    }
    return true;
  }

  async findAllByIdsToBeNotified(usersIds) {
    return await this.userRepository.find({
      where: {
        id: In(usersIds),
        receiveNotifications: true,
      },
    });
  }

  async addTag(tag, user: User) {
    let tags = user.tags;
    if (tags.indexOf(tag) > -1) {
      return;
    }
    tags.push(tag);
    return this.userRepository.update(user.id, {
      tags: this.tagService.formatTags(tags),
    });
  }

  addTags(tags, user: User) {
    const _ = require('lodash/array');

    let newTags = [...tags.split(','), ...user.tags]
    newTags = _.uniq(newTags)

    return this.userRepository.update(user.id, {
      tags: this.tagService.formatTags(newTags),
    }).then(() => newTags);
  }

  createNewLoginToken(userId) {
    const verificationToken = token();
    return this.userRepository
      .update(userId, { verificationToken: verificationToken })
      .then((result) => {
        return verificationToken;
      }).catch((err) => {
        console.log(err)
        return ''
      });
  }

  getUserLoginParams(userId) {
    return this.createNewLoginToken(userId).then((loginToken) => {
      if (loginToken) {
        return `?loginToken=${loginToken}`;
      }
      return '';
    });
  }

  getPhone(userId) {
    return this.findById(userId).then((user) => {
      return user.phone
    });
  }

  public deleteme(currentUser: User) {
    if (currentUser.avatar) {
      this.storageService.delete(currentUser.avatar)
    }

    return this.userRepository
      .delete({ id: currentUser.id })
  }

  public findQrCode(qrcode: string) {
    return this.userRepository.findOne({ where: { qrcode: qrcode } })
  }

  public endorse(userId: string) {
    return this.userRepository.update(userId, {
      endorsed: true
    }).then((result) => this.findById(userId));
  }

  public revokeEndorse(userId: string) {
    return this.userRepository.update(userId, {
      endorsed: false
    }).then((result) => this.findById(userId));
  }

  // admin locale should be the same as network
  public setAdminLocale(locale) {
    this.entityManager.query(`update public.user set locale = '${locale}' where role = '${Role.admin}'`)
  }

  async follow(buttonId: string, userId: string) {
    const user = await this.findById(userId);
    const index = user.follows.indexOf(buttonId);
    if (index < 0) {
      user.follows.push(buttonId);
      return await this.userRepository.save(user);
    }
    return user;
  }

  async unfollow(buttonId: string, userId: string) {
    const user = await this.findById(userId);
    const index = user.follows.indexOf(buttonId);
    if (index > -1) {
      user.follows.splice(index, 1);
      return await this.userRepository.save(user);
    }
    return true;
  }

  markAsRead(user, groupMessageType, date){
    
    if(groupMessageType == GroupMessageType.admin)
    {
      return this.userRepository.update(user.id, {
        readGroupMessages: {...user.readGroupMessages, admin: date},
      });
    }

    if(groupMessageType == GroupMessageType.community)
      {
        return this.userRepository.update(user.id, {
          readGroupMessages: {...user.readGroupMessages, community: date},
        });
      }
  }

  findByIds(userIds : string[]) {
    return this.userRepository.find({where: {id: In(userIds)}})
    .then((users) => users.map((user) => {
      return {username: user.username, name: user.name, id: user.id, avatar: user.avatar};
    }))
  }
}
