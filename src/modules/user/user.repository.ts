import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  async isEmailExists(email: string) {
    const user = await this.findOne({
      where: {
        username: email,
      },
    });

    return user ? true : false;
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
