import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import multer from 'multer'; 
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import{FILE_UPLOAD_SERVICE,STORAGE_DIRECTORY} from './keys';
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {DbDataSource} from './datasources/db.datasource';
import { AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags } from '@loopback/authorization';
import {AuthorizationProvider} from './providers/authorization.provider'
import {CustomTokenService} from './services/custom-token.service';
import {TokenServiceBindings, TokenServiceConstants} from './keys';
import { UserCredentialsRepository, UserRepository } from './repositories';
import { CustomUserService } from './services/custom-user.service';

export {ApplicationConfig};

export class HelpbuttonsBackendApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.configureFileUpload(options.fileStorageDirectory); 

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    // const authOptions: AuthorizationOptions = {
    //   precedence: AuthorizationDecision.DENY,
    //   defaultDecision: AuthorizationDecision.DENY,
    // };
    // this.configure(AuthorizationBindings.COMPONENT).to(authOptions);
    // this.component(AuthorizationComponent);
    const authoptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };
    
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(CustomTokenService);

    // Bind user service inside constructor
    this.bind(UserServiceBindings.USER_SERVICE).toClass(CustomUserService);

    // Bind user and credentials repository
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(
      UserRepository,
    );

    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      UserCredentialsRepository,
    );

    // mount authorization component
    const binding = this.component(AuthorizationComponent);
    // configure authorization component
    this.configure(binding.key).to(authoptions);
    
    this.bind('authorizationProviders.my-authorizer-provider')
      .toProvider(AuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
  }

  protected configureFileUpload(destination?: string) {
    destination = destination ?? path.join(__dirname, '../.uploads');
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
   }
}
