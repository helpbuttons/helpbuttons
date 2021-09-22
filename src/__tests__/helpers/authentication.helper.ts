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
export async function signup(app: HelpbuttonsBackendApp, client: Client): Promise<string> {
  
  const userRepo : UserRepository = await app.get('repositories.UserRepository');
  await userRepo.deleteAll();

  const signupData = {
    "username": "lala",
    "realm" : "lala",
    "email": "testuser2@abc.com",
    "password": "testuser2"
  };
  const res = await client
  .post('/users/signup')
  .send(signupData);
  
  return res.body.id; 
}
export async function login(client: Client): Promise<string> {
  const testUserCredential = {
    email: 'testuser2@abc.com',
    password: 'testuser2',
  };
  const res = await client
  .post('/users/login')
  .send(testUserCredential)
  return res.body.token;
  
}

export interface AppWithClient {
  app: HelpbuttonsBackendApp;
  client: Client;
}
