import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '@src/modules/user/user.entity'
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper'
import { hash } from 'argon2';
import { UserCredential } from '@src/modules/user-credential/user-credential.entity';
import { Network } from '@src/modules/network/network.entity';
import { Button } from '@src/modules/button/button.entity';
import { insert } from './utils';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userId =  dbIdGenerator();
    const hashedPassword = await hash('password');
    const userData = {
      id: userId,
      realm: '',
      username: 'user@email.com',
      verificationToken: 'notokeneeded',
      roles:  ['registered'],
      emailVerified: true,
    };

    await insert(connection, User, userData);
    await insert(connection, UserCredential, {
      id: dbIdGenerator(),
      userId: userId,
      password: hashedPassword
    });

    const networkId = dbIdGenerator();
    await insert(connection, Network, {
      id: networkId,
      name: 'Example Network',
      description: 'this is an example network',
      url: 'https://urlfornetwork.com',
      radius: 10,
      latitude: 38.86323,
      longitude: -9.2697,
      tags: ['tag1', 'tag2'],
      location: () => `ST_MakePoint(38.86323, -9.2697)`,
      avatar: '',
    });

    await insert(connection, Button, 
      {
        id: dbIdGenerator(),
        description: 'this is an example button',
        latitude: 38.86323,
        longitude: -9.2697,
        tags: ['tag1', 'tag2'],
        location: () => `ST_MakePoint(38.86323, -9.2697)`,
        network: {id: networkId},
        owner: {id: userId},
        images: [],
      }
    );
    
  }
}