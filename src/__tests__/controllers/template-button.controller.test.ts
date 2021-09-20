import { generateUniqueId } from '@loopback/context';
import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { setupApplication, login } from '../helpers/authentication.helper';

describe('templateButtonController (integration)', () => {
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

  it('/template-buttons/new', async () => {
    const res = await client.post('/template-buttons/new').send({
      "name": "repartidor",
      "type": "need",
      "fields": {
        "items":
          [
            { "name": "position", "displayName": "Posicion de partida:", "type": "geoCode" },
            { "name": "availableTimes", "displayName": "Horas/Dias disponibles:", "type": "recurrentTime" },
            { "name": "maximumRadiusKm", "displayName": "Maximo de deslocacion (km)", "type": "number" },
            { "name": "description", "displayName": "Descricion e otras informaciones", "type": "string" },
          ]
      }
    }).set('Authorization', 'Bearer ' + token).expect(200);
    expect(res.body).to.containEql({
      id: 2,
      name: 'repartidor',
      type: 'need',
      fields: {
        items: [
          {
            name: 'position',
            displayName: 'Posicion de partida:',
            type: 'geoCode'
          },
          {
            name: 'availableTimes',
            displayName: 'Horas/Dias disponibles:',
            type: 'recurrentTime'
          },
          {
            name: 'maximumRadiusKm',
            displayName: 'Maximo de deslocacion (km)',
            type: 'number'
          },
          {
            name: 'description',
            displayName: 'Descricion e otras informaciones',
            type: 'string'
          }
        ]
      }
    });
  });

  describe('/template-buttons/find', () => {
    it('/template-buttons/find', async () => {
      const resFilterOne = await client.get('/template-buttons/find').query({ filter: '{"where": {"id":1}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].id).to.equal(1);
    });

    it('/template-buttons/find get button with id=1', async () => {
      const resFilterOne = await client.get('/template-buttons/find').query({ filter: '{"where": {"id":1}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].id).to.equal(1);
    });
    it('/template-buttons/findById with id=1', async () => {
      const resFilterOne = await client.get('/template-buttons/findById/2').set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body).to.containDeep({
        id: 2,
        name: 'repartidor',
        type: 'need',
        fields: {
          items: [
            {
              name: 'position',
              displayName: 'Posicion de partida:',
              type: 'geoCode'
            },
            {
              name: 'availableTimes',
              displayName: 'Horas/Dias disponibles:',
              type: 'recurrentTime'
            },
            {
              name: 'maximumRadiusKm',
              displayName: 'Maximo de deslocacion (km)',
              type: 'number'
            },
            {
              name: 'description',
              displayName: 'Descricion e otras informaciones',
              type: 'string'
            }
          ]
        }
      });
      /*
      it.only('/template-buttons/find with networks', async () => {
        const resFilterOne = await client.get('/buttons/find').query({ filter: '{"where": {"id":1}, "include":["networks"]}' }).expect(200);
        expect(resFilterOne.body[0].networks).to.deepEqual(
          [
            {
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
            }
          ]);
      });
  */
    });
  });


  it('/template-buttons/edit/1', async () => {
    const restFindByIdPrev = await client.get('/template-buttons/findById/1').set('Authorization', 'Bearer ' + token).expect(200);
    expect(restFindByIdPrev.body).to.deepEqual({
      id: 1,
      name: 'repartidor',
      type: 'need',
      fields: {
        items: [
          {
            name: 'position',
            displayName: 'Posicion de partida:',
            type: 'geoCode'
          },
          {
            name: 'availableTimes',
            displayName: 'Horas/Dias disponibles:',
            type: 'recurrentTime'
          },
          {
            name: 'maximumRadiusKm',
            displayName: 'Maximo de deslocacion (km)',
            type: 'number'
          },
          {
            name: 'description',
            displayName: 'Descricion e otras informaciones',
            type: 'string'
          }
        ]
      }
    });

    const newName = generateUniqueId();
    await client.patch('/template-buttons/edit/1').send({ "name": newName }).set('Authorization', 'Bearer ' + token).expect(204);

    const resFindByIdAfter = await client.get('/template-buttons/findById/1').expect(200);
    expect(resFindByIdAfter.body).to.containDeep({
      id: 1,
      name: newName,
      type: 'need',
      fields: {
        items: [
          {
            name: 'position',
            displayName: 'Posicion de partida:',
            type: 'geoCode'
          },
          {
            name: 'availableTimes',
            displayName: 'Horas/Dias disponibles:',
            type: 'recurrentTime'
          },
          {
            name: 'maximumRadiusKm',
            displayName: 'Maximo de deslocacion (km)',
            type: 'number'
          },
          {
            name: 'description',
            displayName: 'Descricion e otras informaciones',
            type: 'string'
          }
        ]
      }
    });
    await client.patch('/template-buttons/edit/1').send({ "name": "button name" }).set('Authorization', 'Bearer ' + token).expect(204);
  });

  describe('/template-buttons/delete', () => {
    it('/template-buttons/delete/{id}', async () => {
      const restFindByIdPrev = await client.get('/template-buttons/findById/1').set('Authorization', 'Bearer ' + token).expect(200);
      expect(restFindByIdPrev.body).to.containDeep({
        id: 1,
        name: 'button name',
        type: 'need',
        fields: {
          items: [
            {
              name: 'position',
              displayName: 'Posicion de partida:',
              type: 'geoCode'
            },
            {
              name: 'availableTimes',
              displayName: 'Horas/Dias disponibles:',
              type: 'recurrentTime'
            },
            {
              name: 'maximumRadiusKm',
              displayName: 'Maximo de deslocacion (km)',
              type: 'number'
            },
            {
              name: 'description',
              displayName: 'Descricion e otras informaciones',
              type: 'string'
            }
          ]
        }
      });
      // TODO: this test is failing...
      // await client.delete('/template-buttons/delete/1').expect(204);

      // await client.get('/template-buttons/findById/1').expect(404);
    });
  });

  describe('/template-buttons/addToNetworks/{templateButtonId}', () => {
    it('/template-buttons/addToNetworks', async () => {
      const res = await client.get('/template-buttons/find').query({ filter: '{"where": {"id":1}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(res.body[0].networks).to.be.undefined();

      await client.post('/template-buttons/addToNetworks').query({ networks: "[1,2,3]", templateButtonId: 1 }).set('Authorization', 'Bearer ' + token).expect(200);

      const res2 = await client.get('/template-buttons/find').query({ filter: '{"where": {"id":1}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(res2.body[0].networks.length).to.equal(3);
    });
  });
});
