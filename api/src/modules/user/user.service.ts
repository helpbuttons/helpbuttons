import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Role } from '@src/shared/types/roles';
import { removeUndefined } from '@src/shared/helpers/removeUndefined';
import { configFileName } from '@src/shared/helpers/config-name.const';
import { getUrl } from '@src/shared/helpers/mail.helper';
import { TagService } from '../tag/tag.service';
const config = require(`../../..${configFileName}`);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly tagService: TagService,
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
    let center = null
    if (newUser.center?.coordinates)
    {
      const center =
      `ST_Point(${newUser.center.coordinates[1]}, ${newUser.center.coordinates[0]}, 4326) ::geography`
      this.entityManager.query(`update public.user set center = ${center} where id = '${userId}'`)
    }
    
    delete(newUser.center)
    return this.userRepository.update(
      userId,
      {
          ...newUser,
           tags: this.tagService.formatTags(newUser.tags),
      }
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

  async findAllByIdsToBeNotified(usersIds)
  {
    return await this.userRepository.find({
      where: {
        id: In(usersIds),
        receiveNotifications: true
      }
    })
  }
}
