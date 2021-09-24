require('dotenv').config()

import { authenticate, UserService } from '@loopback/authentication';
import {
  Credentials,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { generateUniqueId, inject } from '@loopback/core';
import { model, property, repository } from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import { CustomUserProfile } from '../types';
import { SecurityBindings, securityId } from '@loopback/security';
import { genSalt, hash } from 'bcryptjs';
import _ from 'lodash';
import { TagController } from '.';
import { User } from '../models';
import { UserExtraRepository, UserRepository } from '../repositories';
import { CustomTokenService } from '../services/custom-token.service';
import { MailBindings, URI } from '../keys';
import { MailService } from '../services/mail.service';
import { logger } from '../logger';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  interests?: string[];

  @property({
    type: 'date',
    default: () => new Date()
  })
  created?: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  modified?: string;

}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
};

export class UserController {
  constructor(
    @inject(MailBindings.SERVICE) public mailerService: MailService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public customTokenService: CustomTokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<CustomUserProfile, Credentials>,
    @inject(SecurityBindings.USER, { optional: true })
    public user: CustomUserProfile,
    @inject(UserServiceBindings.USER_REPOSITORY) protected userRepository: UserRepository,
    @repository(UserExtraRepository)
    public userExtraRepository: UserExtraRepository,
    @inject('controllers.TagController')
    public tagController: TagController,
  ) { }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    const userProfile = this.userService.convertToUserProfile(user);

    if (!user.emailVerified) {
      throw new HttpErrors.Unauthorized('Please activate your account using the link provided by mail');
    }
    // create a JSON Web Token based on the user profile
    const token = await this.customTokenService.generateToken(userProfile);
    return { token };
  }

  @authenticate('jwt')
  @get('/users/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: CustomUserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    await this.isAlreadyTaken(newUserRequest.email);

    const password = await hash(newUserRequest.password, await genSalt());

    newUserRequest.realm = '';
    newUserRequest.username = newUserRequest.email;
    newUserRequest.roles = ["registered"];
    newUserRequest.emailVerified = false;
    newUserRequest.verificationToken = generateUniqueId();

    const savedUser = await this.userRepository.create(
      _.pick(newUserRequest, ['username', 'email', 'realm', 'roles', 'emailVerified', 'verificationToken']),
    );

    await this.userRepository.userCredentials(savedUser.id).create({ password: password });

    await this.userExtraRepository.createForUser(_.pick(newUserRequest, ['interests']), savedUser.id);

    if (newUserRequest.interests)
      await this.tagController.addTags('user', savedUser.id.toString(), newUserRequest.interests);
    
    logger.info(URI);
    const activationUrl: string = URI + 'users/activate/' + savedUser.verificationToken;
    await this.mailerService.sendNotificationMail({
      to: savedUser.email,
      subject: 'Please verify ur account',
      content: 'click here: <a href="' + activationUrl + '">' + activationUrl + '</a>',
    });
    
    //TODO this should not be sent in here.. is only for testing...
    savedUser.verificationToken =  '/users/activate/' + savedUser.verificationToken;
    return savedUser;
  }

  @get('/users/activate/{verificationToken}', {
    responses: {
      '200': {},
    },
  })
  async activate(
    @param.path.string('verificationToken') verificationToken: string,
  ): Promise<string> {
    const user = await this.userRepository.findOne({ where: { 'verificationToken': verificationToken } });
    if (user) {
      return this.userRepository.updateById(user.id, { emailVerified: true }).then(() => {
        return "ok";
      });
    }
    return "fail";
  }

  protected async isAlreadyTaken(email: string) {
    const users = await this.userRepository.find({ where: { 'email': email } });

    if (users && users.length > 0) {
      throw new HttpErrors.UnprocessableEntity('Email already taken');
    }
  }
}
