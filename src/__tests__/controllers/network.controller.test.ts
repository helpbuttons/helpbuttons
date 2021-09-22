import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { ButtonRepository, NetworkRepository } from '../../repositories';
import { setupApplication, login, signup } from '../helpers/authentication.helper';
import { createButton, createNetwork } from '../helpers/data.helper';

describe('NetworkController (integration)', () => {
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

  describe('/networks/new .', () => {
    it('/networks/new', async () => {
      const res = await client.post('/networks/new').send(
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
          "friendNetworks": [1, 2]
        }
      ).set('Authorization', 'Bearer ' + token).expect(200);
      const networkId = res.body.id;
      expect(res.body).to.containDeep({
        "name": "Perritos en adopcion",
        "id": networkId,
        "url": "net/url",
        "avatar": "image/url.png",
        "description": "Net for animal rescue",
        "privacy": "publico",
        "place": "Livorno, Italia",
        "geoPlace": {
          "coordinates": [
            -9.16534423828125,
            38.755154214849426
          ], "type": "Point"
        },
        "radius": 240,
        "tags": [
          "Animales",
          "Perritos",
          "Adopcion"
        ],
        "friendNetworks": [1, 2],
        "owner": userId
      });
    });
  });
  describe('find', () => {

    let buttonId = -1;
    let networkId = -1;

    before('add network', async () => {
      networkId = await createNetwork(client, token);
      buttonId = await createButton(networkId, client, token);
    });

    it('/networks/find', async () => {
      const resFilter = await client.get('/networks/find').send().set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilter.body.length).to.equal(2);

      const resFilterOne = await client.get('/networks/find').query({ filter: '{"where": {"name": {"regexp": "^Perritos"}}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].name).to.startWith('Perritos');
    });

    it('/networks/find include buttons', async () => {
      const resFilter = await client.get('/networks/find').query({
        filter: `{
          "where": {
            "id": `+ networkId + `
          },
          "include": [
            {
              "relation": "buttons",
              "scope": {
                "limit": "1"
              }
            }
          ]
        }`}).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilter.body.length).to.equal(1);
      expect(resFilter.body[0].buttons.length).to.equal(1);
      expect(resFilter.body).to.containDeep(
        [{
          "name": "Perritos en adopcion",
          "id": networkId,
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
          "owner": userId,
          buttons: [
            {
              "id": buttonId,
              "name": "Perritos en adopcion",
              "description": "button for animal rescue",
              "geoPlace": {
                "coordinates": [100, 0],
                "type": "Point"
              },
              "tags": ["Animales", "Perritos", "Adopcion"],
              "type": "offer",
              "owner": userId
            }
          ]
        }]
      );
    });

    it('/networks/find without buttons', async () => {
      const resFilter = await client.get('/networks/find').query({
        filter: `{
        "where": {
          "id": `+networkId+`
        }
      }`}).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilter.body.length).to.equal(1);
      expect(resFilter.body).to.containDeep(
        [{
          "name": "Perritos en adopcion",
          "id": networkId,
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
        }]
      );
    });

  });
});