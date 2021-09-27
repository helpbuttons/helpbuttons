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
            "email": "testuser2@abcd.com",
            "password": "testuser2"
        },
        "expectedResponseBody":
        {
            "realm": "",
            "roles": ["registered"],
            "username": "testuser2@abcd.com",
            "email": "testuser2@abcd.com"
        },
        "expectedResponseCode": 200
    };

    const res = await client.post(endpoint.name).send(endpoint.requestBody).expect(endpoint.expectedResponseCode);
    expect(res.body).to.containEql(endpoint.expectedResponseBody);
  });

  it('/users/signup invalid email', async () => {

    const endpoint = 
    {
        "name": '/users/signup',
        "requestBody":
        {
            "email": "imnotanemail",
            "password": "testuser2"
        },
        "error":
        {
          statusCode: 422,
          name: 'UnprocessableEntityError',
          message: 'The request body is invalid. See error object `details` property for more info.',
          code: 'VALIDATION_FAILED',
          details: [
            {
              path: '/email',
              code: 'type',
              message: 'must be object',
              info: { type: 'object' }
            }
          ]  
        },
        "expectedResponseCode": 422
    };

    const res = await client.post(endpoint.name).send(endpoint.requestBody).expect(endpoint.expectedResponseCode);
    expect(res.body.error).to.containEql(endpoint.error);
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


