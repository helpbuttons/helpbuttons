import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async isEmailExists(email: string) {
    const user = await this.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return true;
    }
    return false;
  }

  async isUsernameExists(username: string) {
    const user = await this.findOne({
      where: {
        username,
      },
    });

    if (user) {
      return true;
    }
    return false;
  }
}
