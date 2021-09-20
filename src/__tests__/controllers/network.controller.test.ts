import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { setupApplication, login } from '../helpers/authentication.helper';

describe('NetworkController (integration)', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;
  let token: string;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    token = await login(client);
  });
  after(async () => {
    await app.stop();
  });

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
        "geoPlace": { "coordinates": [
          -9.16534423828125,
          38.755154214849426
        ], "type": "Point" },
        "radius": 240,
        "friendNetworks": [1, 2]
      }
    ).set('Authorization', 'Bearer ' + token).expect(200);
    expect(res.body).to.containDeep({
      "name": "Perritos en adopcion",
      "id": 5,
      "url": "net/url",
      "avatar": "image/url.png",
      "description": "Net for animal rescue",
      "privacy": "publico",
      "place": "Livorno, Italia",
      "geoPlace": { "coordinates": [
        -9.16534423828125,
        38.755154214849426
      ], "type": "Point" },
      "radius": 240,
      "tags": [
        "Animales",
        "Perritos",
        "Adopcion"
      ],
      "role": "admin", //enum {admin, user, blocked}
      "friendNetworks": [1, 2]
    });
  });

  describe('find', () => {


    before('add network', async () => {
      await client.post('/buttons/new').query({ "networkId": "3" }).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "geoPlace": { "coordinates": [100, 0], "type": "Point" },
      }).set('Authorization', 'Bearer ' + token).expect(200);
    });
    it('/networks/find', async () => {
      const resFilter = await client.get('/networks/find').send().set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilter.body.length).to.equal(5);

      const resFilterOne = await client.get('/networks/find').query({ filter: '{"where": {"name": {"regexp": "^Gat"}}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].name).to.startWith('Gat');
    });

    it('/networks/find include buttons', async () => {
      const resFilter = await client.get('/networks/find').query({
        filter: `{
          "where": {
            "id": 3
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
          name: 'Perritos en adopcion',
          id: 3,
          url: 'net/url',
          avatar: 'image/url.png',
          description: 'Net for animal rescue',
          privacy: 'publico',
          place: 'Livorno, Italia',
          "geoPlace": { "coordinates": [100, 0], "type": "Point" },
          radius: 240,
          tags: ['Animales', 'Perritos', 'Adopcion'],
          role: 'admin',
          buttons: [
            {
              id: 1,
              name: 'button name',
              type: 'exchange',
              tags: ['onetag'],
              description: 'description of da button',
              "geoPlace": { "coordinates": [100, 0], "type": "Point" }
            }
          ]
        }]
      );
    });

    it('/networks/find without buttons', async () => {
      const resFilter = await client.get('/networks/find').query({
        filter: `{
        "where": {
          "id": 3
        }
      }`}).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilter.body.length).to.equal(1);
      expect(resFilter.body).to.deepEqual(
        [{
          name: 'Perritos en adopcion',
          id: 3,
          url: 'net/url',
          avatar: 'image/url.png',
          description: 'Net for animal rescue',
          privacy: 'publico',
          place: 'Livorno, Italia',
          "geoPlace": { "coordinates": [100, 0], "type": "Point" },
          radius: 240,
          tags: ['Animales', 'Perritos', 'Adopcion'],
          role: 'admin'
        }]
      );
    });

  });
});