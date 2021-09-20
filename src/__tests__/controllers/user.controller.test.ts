import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { setupApplication } from '../helpers/authentication.helper';

describe('Users (integration) [users]', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });
  after(async () => {
    await app.stop();
  });

  it('/users/signup', async () => {

    const endpoint = 
    {
        "name": '/users/signup',
        "requestBody":
        {
            "username": "lala",
            "realm" : "lala",
            "email": "testuser2@abcd.com",
            "password": "testuser2"
        },
        "expectedResponseBody":
        {
            "realm": "admin",
            "username": "lala",
            "email": "testuser2@abcd.com"
        },
        "expectedResponseCode": 200
    };

    const res = await client.post(endpoint.name).send(endpoint.requestBody).expect(endpoint.expectedResponseCode);
    expect(res.body).to.containEql(endpoint.expectedResponseBody);
  });

  it('/users/login', async () => {

    const endpoint = 
    {
        "name": '/users/login',
        "requestBody":
        {
            "email": "testuser2@abc.com",
            "password": "testuser2"
        },
        "expectedResponseCode": 200
    };

    const res = await client.post(endpoint.name).send(endpoint.requestBody).expect(200);
    expect(res.body).to.have.property('token');
  });
  
});


