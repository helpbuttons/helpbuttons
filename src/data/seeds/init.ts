import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '@src/modules/user/user.entity'
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper'
import { hash } from 'argon2';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userId =  dbIdGenerator();
    const hashedPassword = await hash('password');
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
            id: userId,
            realm: '',
            username: 'registered@email.com',
            verificationToken: 'notokeneeded',
            roles:  ['registered'],
            emailVerified: true,
        }
      ])
      .execute()
  }
}