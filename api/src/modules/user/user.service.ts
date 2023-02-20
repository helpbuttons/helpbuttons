import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@src/shared/types/roles';

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
        email: email,
      },
    });
    return user ? true : false;
  }

  async findById(id: string) {
    return await this.userRepository.findOne({where: {id}});
  }

  async findAdministrator() {
    // returning only the first admin
    return await this.userRepository.findOne({where: {role: Role.admin}, order: { id: 'DESC' }});
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({where: {email: `${email}`}});
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({where: {username: `${username}`}});
  }
  
}
