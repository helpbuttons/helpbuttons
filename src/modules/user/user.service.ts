import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: User) {
    const id = dbIdGenerator();
    const {
      realm,
      username,
      verificationToken,
      roles,
      emailVerified,
    } = user;
    const createdUser = this.userRepository.create({
      id,
      realm,
      username,
      verificationToken,
      roles,
      emailVerified,
    });

    await this.userRepository.save(createdUser);

    return createdUser;
  }

  async isEmailExists(email: string) {
    const user = await this.userRepository.isEmailExists(email);

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
