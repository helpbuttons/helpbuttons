import { Button } from "@src/modules/button/button.entity";
import { Network } from "@src/modules/network/network.entity";
import { UserCredential } from "@src/modules/user-credential/user-credential.entity";
import { User } from "@src/modules/user/user.entity";
import { dbIdGenerator } from "@src/shared/helpers/nanoid-generator.helper";
import { hash } from "argon2";
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";

export class SEEDDATA1658150010023 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // create new user
        const userId =  dbIdGenerator();
        const hashedPassword = await hash('password');
        
        const user = getRepository(User).create({
            id: userId,
            realm: '',
            username: 'registered@email.com',
            verificationToken: 'notokeneeded',
            roles:  ['registered'],
            emailVerified: true,
        });

        let createdUser = await getRepository(User).save(user);

        const userCredential = getRepository(UserCredential).create({
            id: dbIdGenerator(),
            userId: userId,
            password: hashedPassword
        });

        await getRepository(UserCredential).save(userCredential);
        // create new network
        const network = getRepository(Network).create({
            id: dbIdGenerator(),
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

        let createdNetwork = await getRepository(Network).save(network);

        // create button

        const button = getRepository(Button).create({
            id: dbIdGenerator(),
            name: 'Example Button',
            description: 'this is an example button',
            latitude: 38.86323,
            longitude: -9.2697,
            tags: ['tag1', 'tag2'],
            location: () => `ST_MakePoint(38.86323, -9.2697)`,
            network: createdNetwork,
            owner: createdUser,
            images: [],
            avatar: '',
        });

        await getRepository(Button).save(button);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
