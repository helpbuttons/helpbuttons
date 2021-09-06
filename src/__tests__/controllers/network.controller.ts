import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { setupApplication } from '../helpers/test-helper';

describe('NetworkController (integration)', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
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
        "latitude": 43.33,
        "longitude": 43.33,
        "radius": 240
      }
    ).expect(200);
    expect(res.body).to.containEql({
      "name": "Perritos en adopcion",
      "id": 1,
      "url": "net/url",
      "avatar": "image/url.png",
      "description": "Net for animal rescue",
      "privacy": "publico",
      "place": "Livorno, Italia",
      "latitude": 43.33,
      "longitude": 43.33,
      "radius": 240,
      "tags": [
        "Animales",
        "Perritos",
        "Adopcion"
      ],
      "buttonsTemplate": [], //array of objects, each type has an int, a name and a color associated. Default are offer (green), need (red).
      "role": "admin", //enum {admin, user, blocked}
    });
  });

  describe('find', () => {


    before('add networks', async () => {
      await client.post('/networks/new').send({
        "name": "Perritos en adopcion",
        "place": "Livorno, Italia",
        "tags": ["Animales", "Perritos", "Adopcion"],
        "url": "net/url",
        "avatar": "image/url.png",
        "description": "Net for animal rescue",
        "privacy": "publico",
        "latitude": 43.33,
        "longitude": 43.33,
        "radius": 240
      }).expect(200);
      await client.post('/networks/new').send({
        "name": "Perritos en adopcion",
        "place": "Livorno, Italia",
        "tags": ["Animales", "Perritos", "Adopcion"],
        "url": "net/url",
        "avatar": "image/url.png",
        "description": "Net for animal rescue",
        "privacy": "publico",
        "latitude": 43.33,
        "longitude": 43.33,
        "radius": 240
      }).expect(200);
      await client.post('/networks/new').send({
        "name": "Gatitos en adopcion",
        "place": "Livorno, Italia",
        "tags": ["Animales", "Perritos", "Adopcion"],
        "url": "net/url",
        "avatar": "image/url.png",
        "description": "Net for animal rescue",
        "privacy": "publico",
        "latitude": 43.33,
        "longitude": 43.33,
        "radius": 240
      }).expect(200);
      await client.post('/buttons/new').query({ "networkId": "3" }).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "latitude": 3.12321321,
        "longitude": 5.32421321,
      }).expect(200);
    });
    it('/networks/find', async () => {
      const resFilter = await client.get('/networks/find').send().expect(200);
      expect(resFilter.body.length).to.equal(4);

      const resFilterOne = await client.get('/networks/find').query({ filter: '{"where": {"name": {"regexp": "^Gat"}}}' }).expect(200);
      expect(resFilterOne.body[0].name).to.startWith('Gat');
    });

    it('/networks/find include buttons', async () => {
      const resFilter = await client.get('/networks/find').query({
        filter: `{
        "where": {
          "id": 3
        },
        "include": [
          "buttons"
        ]
      }`}).expect(200);
      expect(resFilter.body.length).to.equal(1);
      expect(resFilter.body[0].buttons.length).to.equal(1);
      expect(resFilter.body).to.deepEqual(
        [{
          name: 'Perritos en adopcion',
          id: 3,
          url: 'net/url',
          avatar: 'image/url.png',
          description: 'Net for animal rescue',
          privacy: 'publico',
          place: 'Livorno, Italia',
          latitude: 43.33,
          longitude: 43.33,
          radius: 240,
          tags: ['Animales', 'Perritos', 'Adopcion'],
          buttonsTemplate: [],
          role: 'admin',
          buttons: [
            {
              id: 1,
              name: 'button name',
              type: 'exchange',
              tags: ['onetag'],
              description: 'description of da button',
              latitude: 3.12321321,
              longitude: 5.32421321
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
      }`}).expect(200);
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
          latitude: 43.33,
          longitude: 43.33,
          radius: 240,
          tags: ['Animales', 'Perritos', 'Adopcion'],
          buttonsTemplate: [],
          role: 'admin'
        }]
      );
    });

  });
});