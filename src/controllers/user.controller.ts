import {authenticate, UserService} from '@loopback/authentication';
import {
  Credentials,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { authorize } from '@loopback/authorization';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import { CustomUserProfile } from '../types';
import {SecurityBindings, securityId} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import { TagController } from '.';
import { User } from '../models';
import { UserExtraRepository, UserRepository } from '../repositories';
import { CustomTokenService } from '../services/custom-token.service';

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
  created ? : string;
  
  @property({
    type: 'date',
    default: () => new Date()
  })
  modified ? : string;

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
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public customTokenService: CustomTokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<CustomUserProfile, Credentials>,
    @inject(SecurityBindings.USER, {optional: true})
    public user: CustomUserProfile,
    @inject(UserServiceBindings.USER_REPOSITORY) protected userRepository: UserRepository,
    @repository(UserExtraRepository)
    public userExtraRepository : UserExtraRepository,
    @inject('controllers.TagController') 
    public tagController: TagController,
  ) {}

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
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    
    const userProfile = this.userService.convertToUserProfile(user);
    
    // create a JSON Web Token based on the user profile
    const token = await this.customTokenService.generateToken(userProfile);
    return {token};
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
    
    const password = await hash(newUserRequest.password, await genSalt());
    
    newUserRequest.realm = 'admin';
    newUserRequest.username = newUserRequest.email;
    const savedUser = await this.userRepository.create(
      _.pick(newUserRequest, ['username','email','realm','role']),
    );
    
    await this.userRepository.userCredentials(savedUser.id).create({password: password});

    await this.userExtraRepository.createForUser(_.pick(newUserRequest, ['interests']), savedUser.id);

    if (newUserRequest.interests)
      await this.tagController.addTags('user',savedUser.id.toString(), newUserRequest.interests);

    return savedUser;
  }
}
