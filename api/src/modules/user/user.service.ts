import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

  async createUser(user: User) {
    const id = dbIdGenerator();
    const {
      realm,
      username,
      verificationToken,
      roles,
      emailVerified,
      name,
      email
    } = user;
    const createdUser = this.userRepository.create({
      id,
      realm,
      username,
      verificationToken,
      roles,
      emailVerified,
      name,
      email
    });

    return this.userRepository.save(createdUser);
  }

  async isEmailExists(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: email,
      },
    });
    return user ? true : false;
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({where: {username: `${email}`}});
  }

  async findById(id: string) {
    return await this.userRepository.findOne({where: {id}});
  }


  whoAmI() {
    // TODO:
  }
}
