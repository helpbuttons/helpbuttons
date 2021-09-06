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

      it('/networks/find', async () => {
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
    
        const resFilter = await client.get('/networks/find').send().expect(200);
        expect(resFilter.body.length).to.equal(4);
    
        const resFilterOne = await client.get('/networks/find').query({filter: '{"where": {"name": {"regexp": "^Gat"}}}'}).expect(200);
        expect(resFilterOne.body[0].name).to.startWith('Gat');
      });
});