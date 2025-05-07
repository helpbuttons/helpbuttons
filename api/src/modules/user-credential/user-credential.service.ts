import { Injectable } from '@nestjs/common';

import { UserCredential } from './user-credential.entity.js';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity.js';

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

    return await this.userCredentialRepository.save(createdUserCredential);
  }

  async updateUserCredential(
    updateUserCredentialDto: Partial<UserCredential>,
  )
  {
    const { password: hashedPassword, userId } =
    updateUserCredentialDto;
    const userCredential = await this.findOne(
      userId,
    );
    return this.userCredentialRepository.update(userCredential.id, {password: hashedPassword});
  }
  async findOne(id: string) {
    return await this.userCredentialRepository.findOne({where: {userId: id}});
  }
}