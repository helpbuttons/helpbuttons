import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto, SignupRequestDto } from './auth.dto';
import { UserService } from '../user/user.service';
import {
  dbIdGenerator,
  publicNanoidGenerator,
} from '@src/shared/helpers/nanoid-generator.helper';
import { UserCredentialService } from '../user-credential/user-credential.service';
import webAppConfig from '@src/app/configs/web-app.config';
import { NodeEnv } from '@src/shared/types';
import { MailService } from '../mail/mail.service';
import { ExtractJwt } from 'passport-jwt';
import { catchError } from 'rxjs';
import { User } from '../user/user.entity';
import { StorageService } from '../storage/storage.service';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';
import { getManager } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    @Inject(webAppConfig.KEY)
    private readonly webAppConfigs: ConfigType<typeof webAppConfig>,
    private readonly mailService: MailService,
    private jwtTokenService: JwtService,
    private readonly storageService: StorageService,
  ) {}

  @Transactional()
  async signup(signupUserDto: SignupRequestDto) {
    const verificationToken = publicNanoidGenerator();
    let emailVerified = false;
    let accessToken = {};

    if (this.webAppConfigs.nodeEnv === NodeEnv.development) {
      emailVerified = true;
    }

    const newUserDto: User = {
      username: signupUserDto.username,
      email: signupUserDto.email,
      roles: ['registered'],
      name: signupUserDto.name,
      verificationToken: publicNanoidGenerator(),
      emailVerified: emailVerified,
      id: dbIdGenerator(),
    };

    await getManager().transaction(
      async (transactionalEntityManager) => {
        try {
          const imageUrl = await this.storageService.newImage64(
            signupUserDto.avatar,
          );
          if (typeof imageUrl === 'string') {
            newUserDto.avatar = imageUrl;
          } else {
            throw new ValidationException({
              avatar: 'failed to get avatar url',
            });
          }
        } catch (err) {
          throw new ValidationException({
            avatar: 'failed to get avatar url',
          });
        }

        try {
          await this.userService
            .createUser(newUserDto)
            .then((user) => {
              return this.createUserCredential(
                newUserDto.id,
                signupUserDto.password,
              );
            });

          if (!newUserDto.emailVerified) {
            await this.sendActivationEmail(newUserDto).then(
              (mailActivation) => {
                console.log(
                  `activation mail sent: ${newUserDto.email}`,
                );
              },
            );
          }

          accessToken = await this.getAccessToken(newUserDto);

        } catch (error) {
          if (typeof error === typeof HttpException) {
            throw error;
          } else if (error?.code === '23505') {
            console.log('registered...');
            throw new HttpException(
              'Email already registered? Do you want to login?',
              HttpStatus.CONFLICT,
            );
          } else {
            console.log(error);
            throw new HttpException(
              'unknown error',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }
        }
      },
    );

    return accessToken;
  }
  private createUserCredential(
    userId,
    plainPassword,
  ): User | PromiseLike<User> | any {
    return this.hashPassword(plainPassword).then((hashedPassword) => {
      return this.userCredentialService.createUserCredential({
        userId: userId,
        password: hashedPassword,
      });
    });
  }

  private sendActivationEmail(user: User) {
    const activationUrl: string = `${this.webAppConfigs.hostName}:${this.webAppConfigs.port}/user/activate/${user.verificationToken}`;
    return this.mailService.sendActivationEmail({
      to: user.email,
      activationUrl,
    });
  }

  activate(verificationToken: string) {
    // TODO:
  }

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      return null;
    }

    const userCredential = await this.userCredentialService.findOne(
      user.id,
    );
    if (!userCredential) {
      return null;
    }

    if (!(await verify(userCredential.password, plainPassword))) {
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

  hashPassword(password: string) {
    return hash(password);
  }

  async getCurrentUser(userId) {
    return this.userService.findById(userId);
  }

  // async login(userId)
  // {
  //   this.getCurrentUser(userId)
  //   .then((user) => {
  //     return this.getAccessToken(user);
  //   })
  // }
}
