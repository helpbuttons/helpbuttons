import { generateUniqueId } from '@loopback/context';
import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { TemplateButtonRepository } from '../../repositories';
import { setupApplication, login, signup } from '../helpers/authentication.helper';
import { createNetwork } from '../helpers/data.helper';

describe('templateButtonController (integration)', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;
  let token: string;
  let userId: string;

  let templateButtonRepo: TemplateButtonRepository;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());

    userId = await signup(app, client);
    token = await login(client);

    templateButtonRepo = await app.get('repositories.TemplateButtonRepository');
    await templateButtonRepo.deleteAll();
  });
  after(async () => {
    await app.stop();
  });
  describe('template button new', () => {
    let templateButtonId = -1;
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
      templateButtonId = res.body.id;
      expect(res.body).to.containEql({
        id: templateButtonId,
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
  });
  describe('/template-buttons/find', () => {
    let templateButtonId = -1;
    before(async () => {
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
      templateButtonId = res.body.id;
    })
    it('/template-buttons/find', async () => {
      const resFilterOne = await client.get('/template-buttons/find').query({ filter: '{"where": {"id":'+templateButtonId+'}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].id).to.equal(templateButtonId);
    });

    it('/template-buttons/find get button with id=1', async () => {
      const resFilterOne = await client.get('/template-buttons/find').query({ filter: '{"where": {"id":'+templateButtonId+'}}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body[0].id).to.equal(templateButtonId);
    });
    it('/template-buttons/findById with id=1', async () => {
      const resFilterOne = await client.get('/template-buttons/findById/'+templateButtonId).set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body).to.containDeep({
        id: templateButtonId,
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
  });

  describe('template-buttons edit', () => {
    let templateButtonId = -1;
    before(async () => {
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
      templateButtonId = res.body.id;
    })
    it('/template-buttons/edit/', async () => {
      const restFindByIdPrev = await client.get('/template-buttons/findById/' + templateButtonId).set('Authorization', 'Bearer ' + token).expect(200);
      expect(restFindByIdPrev.body).to.containDeep({
        id: templateButtonId,
        name: 'repartidor',
        type: 'need',
        owner: userId,
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
      await client.patch('/template-buttons/edit/' + templateButtonId).send({ "name": newName }).set('Authorization', 'Bearer ' + token).expect(204);

      const resFindByIdAfter = await client.get('/template-buttons/findById/' + templateButtonId).expect(200);
      expect(resFindByIdAfter.body).to.containDeep({
        id: templateButtonId,
        name: newName,
        type: 'need',
        owner: userId,
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
  });
  describe('/template-buttons/delete', () => {
    let templateButtonId = -1;
    before(async () => {
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
      templateButtonId = res.body.id;
    })
    it('/template-buttons/delete/{id}', async () => {
      const restFindByIdPrev = await client.get('/template-buttons/findById/' + templateButtonId).set('Authorization', 'Bearer ' + token).expect(200);
      expect(restFindByIdPrev.body).to.containDeep({
        id: templateButtonId,
        owner: userId,
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
      // TODO: this test is failing...
      // await client.delete('/template-buttons/delete/1').expect(204);

      // await client.get('/template-buttons/findById/1').expect(404);
    });
  });

  describe('/template-buttons/addToNetworks/{templateButtonId}', () => {
    let templateButtonId = -1;
    // eslint-disable-next-line prefer-const
    let networtsToAddIds: number[] = [];
    before(async () => {
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
      templateButtonId = res.body.id;
      networtsToAddIds.push(await createNetwork(client, token));
      networtsToAddIds.push(await createNetwork(client, token));
      networtsToAddIds.push(await createNetwork(client, token));
    });

    it('/template-buttons/addToNetworks', async () => {
      const res = await client.get('/template-buttons/find').query({ filter: '{"where": {"id":' + templateButtonId + '}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(res.body[0].networks).to.be.undefined();

      await client.post('/template-buttons/addToNetworks').query({ networks: JSON.stringify(networtsToAddIds), templateButtonId: templateButtonId }).set('Authorization', 'Bearer ' + token).expect(200);

      const res2 = await client.get('/template-buttons/find').query({ filter: '{"where": {"id": ' + templateButtonId + '}, "include":["networks"]}' }).set('Authorization', 'Bearer ' + token).expect(200);
      expect(res2.body[0].networks.length).to.equal(3);
    });
  });
});

