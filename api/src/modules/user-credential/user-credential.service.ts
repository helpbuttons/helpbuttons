import { Injectable } from '@nestjs/common';

import { UserCredential } from './user-credential.entity';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class UserCredentialService {
  constructor(
    @InjectRepository(UserCredential)
    private readonly userCredentialRepository: Repository<UserCredential>
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

  async findOne(id: string) {
    return await this.userCredentialRepository.findOne({where: {userId: id}});
  }
}
