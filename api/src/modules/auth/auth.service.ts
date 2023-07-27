import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto, SignupRequestDto } from './auth.dto';
import { UserService } from '../user/user.service';
import {
  dbIdGenerator,
  publicNanoidGenerator,
} from '@src/shared/helpers/nanoid-generator.helper';
import { UserCredentialService } from '../user-credential/user-credential.service';
import { NodeEnv } from '@src/shared/types';
import { MailService } from '../mail/mail.service';
import { ExtractJwt } from 'passport-jwt';
import { catchError } from 'rxjs';
import { User } from '../user/user.entity';
import { StorageService } from '../storage/storage.service';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';
import { getManager } from 'typeorm';
import { Role } from '@src/shared/types/roles';
import { UserCredential } from '../user-credential/user-credential.entity';
import {
  checkHash,
  generateHash,
} from '@src/shared/helpers/generate-hash.helper';
import { UserUpdateDto } from '../user/user.dto';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { isImageData } from '@src/shared/helpers/imageIsFile';
import { ValidationError } from 'class-validator';
import { configFileName } from '@src/shared/helpers/config-name.const';
const config = require(`../../..${configFileName}`);
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    private readonly mailService: MailService,
    private jwtTokenService: JwtService,
    private readonly storageService: StorageService,
  ) {}

  async signup(signupUserDto: SignupRequestDto) {
    const verificationToken = publicNanoidGenerator();
    let emailVerified = false;
    let accessToken = {};

    let userRole = Role.registered;
    const userCount = await this.userService.userCount();
    if (userCount < 1) {
      userRole = Role.admin;
    }

    const newUserDto = {
      username: signupUserDto.username,
      email: signupUserDto.email,
      role: userRole,
      name: signupUserDto.name,
      verificationToken: publicNanoidGenerator(),
      emailVerified: emailVerified,
      id: dbIdGenerator(),
      avatar: null,
      description: '',
      locale: signupUserDto.locale,
    };

    const emailExists = await this.userService.isEmailExists(
      signupUserDto.email,
    );
    if (emailExists) {
      throw new CustomHttpException(ErrorName.EmailAlreadyRegistered);
    }

    const usernameExists = await this.userService.findByUsername(
      signupUserDto.username,
    );
    if (usernameExists) {
      throw new CustomHttpException(
        ErrorName.UsernameAlreadyRegistered,
      );
    }
    try {
      newUserDto.avatar = await this.storageService.newImage64(
        signupUserDto.avatar,
      );
    } catch (err) {
      throw new CustomHttpException(ErrorName.InvalidMimetype);
    }
    return this.userService
      .createUser(newUserDto)
      .then((user) => {
        return this.createUserCredential(
          newUserDto.id,
          signupUserDto.password,
        );
      })
      .then((user) => {
        if (!newUserDto.emailVerified) {
          this.sendLoginToken(newUserDto);
        }
        return user;
      })
      .then((userCredentials) => {
        return this.getAccessToken(newUserDto);
      })
      .catch((error) => {
        console.error(error);
        throw new CustomHttpException(
          ErrorName.UnspecifiedInternalServerError,
        );
      });
  }
  private async createUserCredential(
    userId,
    plainPassword,
  ): Promise<void | UserCredential> {
    return this.userCredentialService.createUserCredential({
      userId: userId,
      password: generateHash(plainPassword),
    });
  }

  private sendLoginToken(user: User) {
    const activationUrl: string = `${config.hostName}/LoginClick/${user.verificationToken}`;

    if (user.emailVerified === true) {
      this.mailService.sendLoginTokenEmail({
        to: user.email,
        activationUrl,
      });
    }
    this.mailService.sendActivationEmail({
      to: user.email,
      activationUrl,
    });
  }

  async loginToken(verificationToken: string) {
    return await this.userService
      .loginToken(verificationToken)
      .then((user: User) => {
        return this.getAccessToken(user);
      });
  }

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const userCredential = await this.userCredentialService.findOne(
      user.id,
    );
    if (!userCredential) {
      return null;
    }

    if (!(await checkHash(plainPassword, userCredential.password))) {
      return null;
    }

    return this.getAccessToken(user);
  }

  async getAccessToken(user) {
    const payload = { username: user.email, sub: user.id };

    const accesstoken = {
      token: this.jwtTokenService.sign(payload),
    };
    return accesstoken;
  }
  async getCurrentUser(userId) {
    return this.userService.findById(userId);
  }

  async update(data: UserUpdateDto, currentUser) {
    if (data.set_new_password) {
      // save new credentials
      if (
        !(await checkHash(data.password_new, currentUser.password))
      ) {
        throw new CustomHttpException(
          ErrorName.CurrentPasswordWontMatch,
        );
      }
    }

    let newUser = {
      avatar: null,
      email: data.email,
      name: data.name,
      description: data.description,
      locale: data.locale,
    };

    if (isImageData(data.avatar)) {
      try {
        newUser.avatar = await this.storageService.newImage64(
          data.avatar,
        );
      } catch (err) {
        console.log(`avatar: ${err.message}`);
      }
    }
    return this.userService
      .update(currentUser.id, newUser)
      .then(() => {
        if (data.set_new_password) {
          return this.createUserCredential(
            currentUser.id,
            data.password_new,
          ).then(() => true);
        }
        return Promise.resolve(true);
      });
  }

  async requestNewLoginToken(email: string) {
    return await this.userService
      .findOneByEmail(email)
      .then((user: User) => {
        const newUser = {...user, verificationToken: publicNanoidGenerator()};
        this.userService.update(user.id, newUser)
        if (user && user.emailVerified === false) {
          this.sendLoginToken(newUser);
        }
        return Promise.resolve(true);
      });
  }
}
