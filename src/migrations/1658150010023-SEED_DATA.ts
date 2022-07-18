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
            username: 'registered',
            verificationToken: 'notokeneeded',
            roles:  ['registered'],
            emailVerified: true,
        });

        await getRepository(User).save(user);

        const userCredential = getRepository(UserCredential).create({
            id: dbIdGenerator(),
            userId: userId,
            password: hashedPassword
        });

        await getRepository(UserCredential).save(userCredential);
        // create new network
        // create button

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
