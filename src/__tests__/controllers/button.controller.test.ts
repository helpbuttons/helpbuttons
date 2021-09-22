import { generateUniqueId } from '@loopback/context';
import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { ButtonRepository, NetworkRepository } from '../../repositories';
import { setupApplication, login, signup } from '../helpers/authentication.helper';
import { createButton, createNetwork } from '../helpers/data.helper';

describe('ButtonController (integration)', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;
  let token: string;
  let userId: string;

  let buttonRepo: ButtonRepository;
  let networkRepo: NetworkRepository;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());

    userId = await signup(app, client);
    token = await login(client);

    buttonRepo = await app.get('repositories.ButtonRepository');
    await buttonRepo.deleteAll();

    networkRepo = await app.get('repositories.NetworkRepository');
    await networkRepo.deleteAll();
  });
  after(async () => {
    await app.stop();
  });
  describe('/buttons/new .', () => {
    it('/buttons/new', async () => {
      const networkId = await createNetwork(client, token);
      const res = await client.post('/buttons/new/').query({ networkId: networkId }).set('Authorization', 'Bearer ' + token).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "geoPlace": { "type": "Point", "coordinates": [100.0, 0.0] }
      }).set('Authorization', 'Bearer ' + token);
      expect(res.body).to.containDeep({
        name: 'button name',
        type: 'exchange',
        tags: ['onetag'],
        description: 'description of da button',
        geoPlace: {
          coordinates: [100, 0],
          type: "Point"
        },
        owner: userId,
      });
      expect(res.statusCode).to.equal(200);
    });

    it('/buttons/new with invalid geoLocation', async () => {
      const res = await client.post('/buttons/new').query({ networkId: 4 }).set('Authorization', 'Bearer ' + token).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "geoPlace": { "type": "LineString", "coordinates": [100.0, 0.0] }
      }).set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).to.equal(422);
      // expect(res["error"].text).to.equal('`geoPlace` is not well formated, please check the documentation at https://geojson.org/');
    });
  });

  describe('/buttons/find', () => {
    let buttonId = -1;
    let networkId = -1;

    before('find buttons', async () => {
      networkId = await createNetwork(client, token);
      buttonId = await createButton(networkId, client, token);
      const networks = [networkId];
      await client.post('/buttons/addToNetworks/' + buttonId).set('Authorization', 'Bearer ' + token).query({ networks: JSON.stringify(networks) }).expect(200);
    });

    it('/buttons/find with networks', async () => {
      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"id":' + buttonId + '}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].networks).to.containDeep(
        [
          {
            "name": "Perritos en adopcion",
            "place": "Livorno, Italia",
            "tags": ["Animales", "Perritos", "Adopcion"],
            "url": "net/url",
            "avatar": "image/url.png",
            "description": "Net for animal rescue",
            "privacy": "publico",
            "geoPlace": {
              "coordinates": [
                -9.16534423828125,
                38.755154214849426
              ], "type": "Point"
            },
            "radius": 240,
            "friendNetworks": [1, 2],
            "owner": userId
          }
        ]);
    });

    it('/buttons/find without networks', async () => {
      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"id":' + buttonId + '}}' }).set('Authorization', 'Bearer ' + token).expect(200);

      expect(resFilterOne.body[0].networks).to.be.undefined();
    });

    it('/buttons/find get button with id=X', async () => {
      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"id":' + buttonId + '}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].id).to.equal(buttonId);
    });


    it('/buttons/findById get button with id=X', async () => {

      const resFilterOne = await client.get('/buttons/findById/' + buttonId).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body).to.containDeep({
        "name": "Perritos en adopcion",
        "description": "button for animal rescue",
        "geoPlace": {
          "coordinates": [100, 0],
          "type": "Point"
        },
        "tags": ["Animales", "Perritos", "Adopcion"],
        "type": "offer"
      });
    });
  });
  describe('/buttons/edit', () => {
    let buttonId = -1;
    let networkId = -1;
    before('edit buttons', async () => {
      networkId = await createNetwork(client, token);
      buttonId = await createButton(networkId, client, token);
    });
    it('/buttons/edit/X', async () => {
      const restFindByIdPrev = await client.get('/buttons/findById/' + buttonId).set('Authorization', 'Bearer ' + token).expect(200);

      expect(restFindByIdPrev.body).to.containDeep({
        "name": "Perritos en adopcion",
        "description": "button for animal rescue",
        "geoPlace": {
          "coordinates": [100, 0],
          "type": "Point"
        },
        "tags": ["Animales", "Perritos", "Adopcion"],
        "type": "offer",
        "id": buttonId,
        "owner": userId
      });
      const newName = generateUniqueId();
      
      await client.patch('/buttons/edit/'+buttonId).set('Authorization', 'Bearer ' + token).send({ "name": newName }).expect(204);

      const resFindByIdAfter = await client.get('/buttons/findById/'+buttonId).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFindByIdAfter.body).to.containDeep({
        "name": newName,
        "description": "button for animal rescue",
        "geoPlace": {
          "coordinates": [100, 0],
          "type": "Point"
        },
        "tags": ["Animales", "Perritos", "Adopcion"],
        "type": "offer",
        "id": buttonId,
        "owner": userId
      });
    });
  });
  describe('/buttons/delete', () => {
    let buttonId = -1;
    let networkId = -1;
    before('delete button', async () => {
      networkId = await createNetwork(client, token);
      buttonId = await createButton(networkId, client, token);
    });
    it('/buttons/delete/{id}', async () => {
      const restFindByIdPrev = await client.get('/buttons/findById/'+buttonId).set('Authorization', 'Bearer ' + token).expect(200);
      expect(restFindByIdPrev.body).to.containDeep({
        "id": buttonId,
        "owner": userId,
        "name": "Perritos en adopcion",
        "description": "button for animal rescue",
        "geoPlace": {
          "coordinates": [100, 0],
          "type": "Point"
        },
        "tags": ["Animales", "Perritos", "Adopcion"],
        "type": "offer"
      });

      await client.delete('/buttons/delete/'+buttonId).set('Authorization', 'Bearer ' + token).expect(204);

      await client.get('/buttons/findById/' + buttonId).set('Authorization', 'Bearer ' + token).expect(404);
    });
  });

  describe('/buttons/addToNetworks/{buttonId}', () => {
    let buttonId = -1;
    let networkId = -1;

    // eslint-disable-next-line prefer-const
    let networtsToAddIds: number[] = [];
    before('delete button', async () => {
      networkId = await createNetwork(client, token);
      networtsToAddIds.push(await createNetwork(client, token));
      networtsToAddIds.push(await createNetwork(client, token));
      networtsToAddIds.push(await createNetwork(client, token));
      buttonId = await createButton(networkId, client, token);
    });
    it('/buttons/addToNetworks', async () => {
      const res = await client.get('/buttons/find').query({ filter: '{"where": {"id":'+buttonId+'}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(res.body[0].networks.length).to.equal(1);

      await client.post('/buttons/addToNetworks/'+buttonId).set('Authorization', 'Bearer ' + token).query({ networks: JSON.stringify(networtsToAddIds)}).expect(200);

      const res2 = await client.get('/buttons/find').set('Authorization', 'Bearer ' + token).query({ filter: '{"where": {"id":'+buttonId+'}, "include":["networks"]}' }).expect(200);
      expect(res2.body[0].networks.length).to.equal(4);
    });
  });
});
