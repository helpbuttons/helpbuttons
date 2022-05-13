import { Injectable } from '@nestjs/common';
import {
  dbIdGenerator,
  publicNanoidGenerator,
} from '@src/shared/helpers/nanoid-generator.helper';
import { hash } from 'argon2';

import { LoginDto, SignupUserDto } from './user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(signupUserDto: SignupUserDto) {
    const {
      email,
      interests,
      password: plainPassword,
      realm,
      username,
    } = signupUserDto;
    const verificationToken = publicNanoidGenerator();
    const emailVerified = false;
    const roles = ['user'];
    const id = dbIdGenerator();
    const password = await this.hashPassword(plainPassword);
    const user = this.userRepository.create({
      id,
      email,
      realm,
      username,
      verificationToken,
      roles,
      emailVerified,
      password,
      interests,
    });

    await this.userRepository.save(user);

    return user;
  }

  activate(verificationToken: string) {
    // TODO:
  }

  login(loginDto: LoginDto) {
    // TODO:
  }

  whoAmI() {
    // TODO:
  }

  hashPassword(password: string) {
    return hash(password);
  }
}
