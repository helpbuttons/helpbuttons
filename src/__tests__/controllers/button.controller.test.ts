import { generateUniqueId } from '@loopback/context';
import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { setupApplication, login } from '../helpers/authentication.helper';

describe('ButtonController (integration)', () => {
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
  describe.only('/buttons/new .', () => {
    it('/buttons/new', async () => {
      const res = await client.post('/buttons/new').query({ networkId: 4 }).set('Authorization', 'Bearer ' + token).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        "geoPlace": { "type": "Point", "coordinates": [100.0, 0.0] }
      }).set('Authorization', 'Bearer ' + token);
      expect(res.body).to.containDeep({
        id: 6,
        name: 'button name',
        type: 'exchange',
        tags: ['onetag'],
        description: 'description of da button',
        geoPlace: {
          coordinates: [100, 0],
          type: "Point"
        }
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


    before('add buttons', async () => {
      await client.post('/buttons/new').query({ networkId: 3 }).set('Authorization', 'Bearer ' + token).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "onetag"
        ],
        "description": "description of da button",
        geoPlace: {
          coordinates: [100, 0],
          type: "Point"
        }
      }).set('Authorization', 'Bearer ' + token).expect(200);
    });
    it('/buttons/find with networks', async () => {
      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"id":1}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].networks).to.containDeep(
        [
          {
            name: 'Perritos en adopcion',
            id: 3,
            url: 'net/url',
            avatar: 'image/url.png',
            description: 'Net for animal rescue',
            privacy: 'publico',
            place: 'Livorno, Italia',
            geoPlace: {
              coordinates: [100, 0],
              type: "Point"
            },
            radius: 240,
            tags: ['Animales', 'Perritos', 'Adopcion'],
            role: 'admin'
          }
        ]);
    });

    it('/buttons/find without networks', async () => {
      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"id":1}}' }).set('Authorization', 'Bearer ' + token).expect(200);

      expect(resFilterOne.body[0].networks).to.be.undefined();
    });

    it('/buttons/find get button with id=1', async () => {
      const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"id":1}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].id).to.equal(1);
    });

  });

  it('/buttons/findById get button with id=1', async () => {

    const resFilterOne = await client.get('/buttons/findById/1').set('Authorization', 'Bearer ' + token).expect(200);
    expect(resFilterOne.body).to.deepEqual({
      id: 1,
      name: 'button name',
      type: 'exchange',
      tags: ['onetag'],
      description: 'description of da button',
      geoPlace: {coordinates: [100, 0],type: "Point"},
    });
  });


  it('/buttons/edit/1', async () => {
    const restFindByIdPrev = await client.get('/buttons/findById/1').set('Authorization', 'Bearer ' + token).expect(200);
    expect(restFindByIdPrev.body).to.deepEqual({
      id: 1,
      name: 'button name',
      type: 'exchange',
      tags: ['onetag'],
      description: 'description of da button',
      geoPlace: {
        coordinates: [100, 0],
        type: "Point"
      }
    });

    const newName = generateUniqueId();
    await client.patch('/buttons/edit/1').set('Authorization', 'Bearer ' + token).send({ "name": newName }).expect(204);

    const resFindByIdAfter = await client.get('/buttons/findById/1').set('Authorization', 'Bearer ' + token).expect(200);
    expect(resFindByIdAfter.body).to.containDeep({
      id: 1,
      name: newName,
      type: 'exchange',
      tags: ['onetag'],
      description: 'description of da button',
      geoPlace: {
        coordinates: [100, 0],
        type: "Point"
      }
    });
    await client.patch('/buttons/edit/1').send({ "name": "button name" }).set('Authorization', 'Bearer ' + token).expect(204);
  });

  describe('/buttons/delete', () => {
    it('/buttons/delete/{id}', async () => {
      const restFindByIdPrev = await client.get('/buttons/findById/3').set('Authorization', 'Bearer ' + token).expect(200);
      expect(restFindByIdPrev.body).to.deepEqual({
        id: 3,
        name: 'button name',
        type: 'exchange',
        tags: ['onetag'],
        description: 'description of da button',
        geoPlace: {coordinates: [100, 0], type: "Point"}
      });

      await client.delete('/buttons/delete/3').set('Authorization', 'Bearer ' + token).expect(204);

      await client.get('/buttons/findById/3').set('Authorization', 'Bearer ' + token).expect(404);
    });
  });

  describe('/buttons/addToNetworks/{buttonId}', () => {
    it('/buttons/addToNetworks', async () => {
      const res = await client.get('/buttons/find').query({ filter: '{"where": {"id":4}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(res.body[0].networks).to.be.undefined();

      await client.post('/buttons/addToNetworks').set('Authorization', 'Bearer ' + token).query({ networks: "[1,2,3]", buttonId: 4 }).expect(200);

      const res2 = await client.get('/buttons/find').set('Authorization', 'Bearer ' + token).query({ filter: '{"where": {"id":4}, "include":["networks"]}' }).expect(200);
      expect(res2.body[0].networks.length).to.equal(3);
    });
  });
});
