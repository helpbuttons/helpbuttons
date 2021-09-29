import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { TagRepository } from '../../repositories';
import { setupApplication, login, signup } from '../helpers/authentication.helper';

describe('tag (integration)', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;
  let token: string;
  let userId: string;

  let tagRepository: TagRepository;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId = await signup(app, client);
    token = await login(client);

    tagRepository = await app.get('repositories.TagRepository');
    await tagRepository.deleteAll();
  });
  after(async () => {
    await app.stop();
  });
  describe('tag new from network', () => {
    let networkId = -1;
    it('create new network to create new tags', async () => {
      const res = await client.post('/networks/new').send(
        {
          "name": "Perritos en adopcion",
          "place": "Livorno, Italia",
          "tags": ["livorno", "queso"],
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
      networkId = res.body.id;
    });

    it('check if tags were created', async () => {
      const rest = await client.get('/tags').set('Authorization', 'Bearer ' + token).expect(200)

      expect(rest.body.length).to.equal(2);
      expect(rest.body).to.containDeep(
        [
          {
            id: 'livorno',
            modelName: 'network',
          },
          {
            id: 'queso',
            modelName: 'network',
          }
        ]
      );
    });


    it('create new button to create new tags', async () => {
      await client.post('/buttons/new/').query({ networkId: networkId }).send({
        "name": "button name",
        "type": "exchange",
        "tags": [
          "queso", "pizza"
        ],
        "description": "description of da button",
        "geoPlace": { "type": "Point", "coordinates": [100.0, 0.0] }
      }
      ).set('Authorization', 'Bearer ' + token).expect(200);

      const rest = await client.get('/tags/').set('Authorization', 'Bearer ' + token).expect(200);
      expect(rest.body.length).to.equal(4);
      expect(rest.body).to.containDeep([
        {
          id: 'livorno',
          modelName: 'network',
        },
        {
          id: 'queso',
          modelName: 'network',
        },
        {
          id: 'queso',
          modelName: 'button',
        },
        {
          id: 'pizza',
          modelName: 'button',
        },
      ]);
    });
    it('/tags/findByTag/{tag}', async () => {
      const resFilterOne = await client.get('/tags/findByTag/queso').set('Authorization', 'Bearer ' + token).expect(200);
      expect(resFilterOne.body.length).to.equal(2);
      expect(resFilterOne.body).to.containDeep([
        {
          id: 'queso',
          modelName: 'button',
        },
        {
          id: 'queso',
          modelName: 'network',
        },
      ]);
    });
  });
});

