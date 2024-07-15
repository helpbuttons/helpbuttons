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
import { EntityManager, In, Repository } from 'typeorm';
import { Role } from '@src/shared/types/roles';
import { removeUndefined } from '@src/shared/helpers/removeUndefined';
import { TagService } from '../tag/tag.service';
import { publicNanoidGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { plainToClass } from 'class-transformer';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly tagService: TagService,
    private readonly storageService: StorageService,
  ) {}

  createUser(user: User) {
    return this.userRepository.insert([user]);
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

  findCounts(user){
    return Promise.all([
      this.entityManager.query(
        `select sum(cardinality("followedBy")) as "followsCount" from button where "ownerId"= '${user.id}' `
      ),
      this.entityManager.query(
        `select count(button.id) as "buttonsCount" from button where "ownerId" = '${user.id}'`
      ),
      this.entityManager.query(
        `select count(post.id) as "postsCount" from post where "authorId" = '${user.id}'`
      ),
      this.entityManager.query(
        `select count(comment.id) as "commentsCount" from comment where "authorId" = '${user.id}'`
      ),
    ]).then(([followsCount, buttonCount, postCount, commentCount]) => {
      return {
        ...user,
        followsCount: followsCount[0].followsCount,
        commentCount: parseInt(commentCount[0].commentsCount) + parseInt(postCount[0].postsCount),
        buttonCount: buttonCount[0].buttonsCount,
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
      });
  }

  update(userId: string, newUser) {
    let center = null;
    if (newUser.center?.coordinates) {
      const center = `ST_Point(${newUser.center.coordinates[1]}, ${newUser.center.coordinates[0]}, 4326) ::geography`;
      this.entityManager.query(
        `update public.user set center = ${center} where id = '${userId}'`,
      );
    }

    delete newUser.center;
    return this.userRepository.update(userId, {
      ...newUser,
      tags: this.tagService.formatTags(newUser.tags),
    });
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
    return this.userRepository.update(userId, { role: newRole });
  }

  async moderationList() {
    return {
      administrators: await this.findAdministrators(),
      blocked: await this.userRepository.find({
        where: { role: Role.blocked },
      }),
    };
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
  createNewLoginToken(userId) {
    const verificationToken = publicNanoidGenerator();
    return this.userRepository
      .update(userId, { verificationToken: verificationToken })
      .then((result) => {
        return verificationToken;
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
      if(user.publishPhone)
      {
        return user.phone
      }
      return ''
    });
  }

  public deleteme(currentUser: User)
  {
    if(currentUser.avatar)
    {
      this.storageService.delete(currentUser.avatar)
    }

    return this.userRepository
        .delete({id: currentUser.id})
  }
}
