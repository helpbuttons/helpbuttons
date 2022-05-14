import { Injectable } from '@nestjs/common';

import { UserCredential } from './user-credential.entity';
import { UserCredentialRepository } from './user-credential.repository';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';

@Injectable()
export class UserCredentialService {
  constructor(
    private readonly userCredentialRepository: UserCredentialRepository,
  ) {}

  async createUserCredential(
    createUserCredentialDto: Partial<UserCredential>,
  ) {
    const { password: hashedPassword, userId } =
      createUserCredentialDto;
    const createdUserCredential =
      this.userCredentialRepository.create({
        id: dbIdGenerator(),
        userId,
        password: hashedPassword,
      });

    await this.userCredentialRepository.save(createdUserCredential);
  }
}
