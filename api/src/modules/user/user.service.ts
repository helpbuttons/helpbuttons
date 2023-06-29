import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@src/shared/types/roles';
import { removeUndefined } from '@src/shared/helpers/removeUndefined';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    ) {}

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

  async userCount()
  {
    return await this.userRepository.count();
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
 
  async update(userId : string, newUser) {
    return this.userRepository.update(userId, removeUndefined(newUser))
  }

  loginToken(verificationToken: string)
  {
    return this.userRepository.findOne({where: {verificationToken: `${verificationToken}`}}).then((user: User) => {
      return this.userRepository.update(user.id, {...removeUndefined(user), verificationToken: '', emailVerified: true}).then(() => {return user})
    });
  }
}
