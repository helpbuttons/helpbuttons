require('dotenv').config()
import {BindingKey} from '@loopback/core';
import {FileUploadHandler} from './types';

/**
 * Binding key for the file upload service
 */
export const FILE_UPLOAD_SERVICE = BindingKey.create<FileUploadHandler>(
  'services.FileUpload',
);

/**
 * Binding key for the storage directory
 */
export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');


import {TokenService} from '@loopback/authentication';
import { MailService } from './services/mail.service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '60000';
}
export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace MailBindings {
  export const SERVICE = BindingKey.create<MailService>('mail.services');
}

export const URI = 'https://' + process.env.HOST + (process.env.PORT ? ':'+process.env.PORT : '') + '/';
// export namespace UserServiceBindings {
//   export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
//     'services.user.service',
//   );
//   export const DATASOURCE_NAME = 'jwtdb';
//   export const USER_REPOSITORY = 'repositories.UserRepository';
//   export const USER_CREDENTIALS_REPOSITORY =
//     'repositories.UserCredentialsRepository';
// }
