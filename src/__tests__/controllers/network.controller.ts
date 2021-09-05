import {Client, expect} from '@loopback/testlab';
import {HelpbuttonsBackendApp} from '../..';
import {setupApplication} from '../helpers/test-helper';

describe('NetworkController (integration)', () => {
    let app: HelpbuttonsBackendApp;
    let client: Client;
  
    before('setupApplication', async () => {
      ({app, client} = await setupApplication());
    });
    after(async () => {
        await app.stop();
      });
    
      it('/networks/new', async () => {
        const res = await client.post('/networks/new').send({
          "name": "red de tests",
          "url": "https://testes.com",
          "avatar": "/lala/lala.png",
          "description": "descricion de nuestra red",
          "privacy": "privado",
          "place": "en alemania",
          "latitude": 3.445454,
          "longitude": 3.434343,
          "radius": 3,
          "template": {}
        }).expect(200);
        expect(res.body).to.containEql({
          name: 'red de tests',
          id: 1,
          url: 'https://testes.com',
          avatar: '/lala/lala.png',
          description: 'descricion de nuestra red',
          privacy: 'privado',
          place: 'en alemania',
          latitude: 3.445454,
          longitude: 3.434343,
          radius: 3,
          template: {}
        });
      });
      
});