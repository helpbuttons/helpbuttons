import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '@src/modules/user/user.entity'
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper'
import { hash } from 'argon2';
import { UserCredential } from '@src/modules/user-credential/user-credential.entity';
import { Network } from '@src/modules/network/network.entity';
import { Button, ButtonType } from '@src/modules/button/button.entity';
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
      name: 'Fighting loneliness',
      description: 'Fight loneliness all over the world just by interacting with people in need. Any person needing to be listened and cared can be found here.',
      url: 'https://loneliness.com',
      radius: 10,
      latitude: 38.86,
      longitude: -3.26,
      tags: ['tag1', 'tag2'],
      location: () => `ST_MakePoint(38.86323, -3.2697)`,
      avatar: '',
    });

    await insert(connection, Button, {
      id: dbIdGenerator(),
      type: ButtonType.OFFER,
      description: 'I could visit a lonely person once or twice a week',
      latitude: 38.86,
      longitude: -3.26,
      tags: ['visit'],
      location: () => `ST_MakePoint(38.86, -3.26)`,
      network: {id: networkId},
      owner: {id: userId},
      images: [],
    });

    await insert(connection, Button, {
      id: dbIdGenerator(),
      type: ButtonType.OFFER,
      description: 'I\'m available for calling someone and reduce their loneliness',
      latitude: 38.87,
      longitude: -3.12,
      tags: ['phone', 'videocall'],
      location: () => `ST_MakePoint(38.87, -3.12)`,
      network: {id: networkId},
      owner: {id: userId},
      images: [],
    });

    await insert(connection, Button, {
      id: dbIdGenerator(),
      type: ButtonType.NEED,
      description: 'My neighbour has no family and cannot easily walk outside, would need some company',
      latitude: 38.75,
      longitude: -3.33,
      tags: ['visit'],
      location: () => `ST_MakePoint(38.75, -3.33)`,
      network: {id: networkId},
      owner: {id: userId},
      images: [],
    });

    await insert(connection, Button, {
      id: dbIdGenerator(),
      type: ButtonType.EXCHANGE,
      description: 'I have no family or friends, if you are also alone we could talk',
      latitude: 38.88,
      longitude: -3.19,
      tags: ['visit', 'phone'],
      location: () => `ST_MakePoint(38.88, -3.19)`,
      network: {id: networkId},
      owner: {id: userId},
      images: [],
    });

  }
}
