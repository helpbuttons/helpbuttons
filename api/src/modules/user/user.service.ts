import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

  async createUser(user: User) {
    return this.userRepository.insert([user]);
  }

  async isEmailExists(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: email,
      },
    });
    return user ? true : false;
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({where: {username: `${email}`}});
  }

  async findById(id: string) {
    return await this.userRepository.findOne({where: {id}});
  }


  async findAdministrator() :Promise<User> {
    return await this.userRepository.findOne({order: { id: 'DESC' }});
  }
  whoAmI() {
    // TODO:
  }
}
