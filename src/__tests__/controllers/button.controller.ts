import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { setupApplication } from '../helpers/test-helper';

describe('ButtonController (integration)', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });
  after(async () => {
    await app.stop();
  });

  it('/buttons/new', async () => {
    const res = await client.post('/buttons/new').query({ networkId: 3 }).send({
      "name": "button name",
      "type": "exchange",
      "tags": [
        "onetag"
      ],
      "description": "description of da button",
      "latitude": 3.12321321,
      "longitude": 5.32421321,
    }).expect(200);
    expect(res.body).to.containEql({
      id: 1,
      name: 'button name',
      type: 'exchange',
      tags: ['onetag'],
      description: 'description of da button',
      latitude: 3.12321321,
      longitude: 5.32421321
    });
  });

  describe('/buttons/find', () => {


    before('add networks', async () => {
      await client.post('/buttons/new').query({ networkId: 3 }).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "latitude": 3.12321321,
        "longitude": 5.32421321
      }).expect(200);
      await client.post('/buttons/new').query({ networkId: 3 }).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "latitude": 3.12321321,
        "longitude": 5.32421321
      }).expect(200);
      await client.post('/buttons/new').query({ networkId: 3 }).send({
        "name": "forthat name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "latitude": 3.12321321,
        "longitude": 5.32421321
      }).expect(200);
    });
    it('/buttons/find with networks', async () => {

      const resFilter = await client.get('/buttons/find').send().expect(200);
      expect(resFilter.body.length).to.equal(4);

      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"name": {"regexp": "^f"}}}' }).expect(200);
      expect(resFilterOne.body[0].name).to.startWith('f');
    });

    it('/buttons/find without networks', async () => {

      const resFilter = await client.get('/buttons/find').send().expect(200);
      expect(resFilter.body.length).to.equal(4);

      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"name": {"regexp": "^f"}}}' }).expect(200);
      expect(resFilterOne.body[0].name).to.startWith('f');
    });
  });

});