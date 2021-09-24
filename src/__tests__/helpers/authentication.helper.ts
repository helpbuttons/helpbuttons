import {HelpbuttonsBackendApp} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import { UserRepository } from '@loopback/authentication-jwt';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new HelpbuttonsBackendApp({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);
  return {app, client};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signup(app: HelpbuttonsBackendApp, client: Client, customSignupData?: any ): Promise<string> {
  
  const userRepo : UserRepository = await app.get('repositories.UserRepository');
  await userRepo.deleteAll();

  let signupData = {
    "username": "lala",
    "realm" : "lala",
    "email": "testuser2@abc.com",
    "password": "testuser2"
  };
  signupData = {
    ...signupData,
    ...customSignupData,
  };
  
  const res = await client
  .post('/users/signup')
  .send(signupData);
  
  // activate account
  await client.get(res.body.verificationToken);

  return res.body.id; 
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(client: Client, customUserCredential?: any): Promise<string> {
  let userCredential = {
    email: 'testuser2@abc.com',
    password: 'testuser2',
  };

  userCredential = {
    ...userCredential,
    ...customUserCredential,
  };
  const res = await client
  .post('/users/login')
  .send(userCredential)
  
  return res.body.token;
  
}

export interface AppWithClient {
  app: HelpbuttonsBackendApp;
  client: Client;
}
