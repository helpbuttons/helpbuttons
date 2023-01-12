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
import { publicNanoidGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { UserCredentialService } from '../user-credential/user-credential.service';
import webAppConfig from '@src/app/configs/web-app.config';
import { NodeEnv } from '@src/shared/types';
import { MailService } from '../mail/mail.service';
import { ExtractJwt } from 'passport-jwt';
import { catchError } from 'rxjs';
import { User } from '../user/user.entity';
import { StorageService } from '../storage/storage.service';
import { ValidationException } from '@src/shared/middlewares/errors/validation-filter.middleware';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userCredentialService: UserCredentialService,
    @Inject(webAppConfig.KEY)
    private readonly webAppConfigs: ConfigType<typeof webAppConfig>,
    private readonly mailService: MailService,
    private jwtTokenService: JwtService,
    private readonly storageService: StorageService
  ) {}

  @Transactional()
  async signup(
    signupUserDto: SignupRequestDto
    ) {
    
    const verificationToken = publicNanoidGenerator();
    let emailVerified = false;

    if (this.webAppConfigs.nodeEnv === NodeEnv.development) {
      emailVerified = true;
    }

    const user: User = {
      username: 'myusername',
      email: 'mail@com.com',
      roles : [],
      name: 'something',
    }
    
    try {
      const imageUrl = await this.storageService.newImage64(
        signupUserDto.avatar
      );
      if (typeof imageUrl === "string") {
        user.avatar = imageUrl
      }
    } catch (err) {
      throw new ValidationException({ avatar: err.message });
    }
    
    return this.createUser(signupUserDto, emailVerified)
      .then((user) => {
 
        return {
          user: user,
          credentials: this.createUserCredential(user.id, signupUserDto.password),
        };
      }).then(({user, credentials}) => {
        if (!user.emailVerified) {
          this.sendActivationEmail(user).then((mailActivation) => {
            return {user, credentials };
          })
        }
        return {user, credentials };
      })
      .then(({ user, credentials }) => {
        return this.getAccessToken(user);
      })
      .catch((error) => {
        if (error?.statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
          throw new HttpException(
            'Error',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }else if (error?.code === '23505') {
          throw new HttpException(
            'Email already registered? Do you want to login?',
            HttpStatus.CONFLICT,
          );
        }
        
      });
  }

  private createUser(signupUserDto: SignupRequestDto, emailVerified: boolean) {
    const verificationToken = publicNanoidGenerator();
    const {
      email,
      // interests,
      password,
      // realm,
      username,
    } = signupUserDto;

    const roles = ['registered'];

    return this.userService
    .createUser({
      // realm,
      email,
      verificationToken,
      emailVerified,
      roles,
      username,
      name: '',
    })
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
    return this.mailService
      .sendActivationEmail({
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

    return {
      token: this.jwtTokenService.sign(payload),
    };
  }

  hashPassword(password: string) {
    return hash(password);
  }

  async getCurrentUser(userId) {
    return this.userService.findById(userId);
  }
}
