import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { login, setupApplication, signup } from '../helpers/authentication.helper';

describe('ButtonController (integration)', () => {
  let app: HelpbuttonsBackendApp;
  let client: Client;
  let token: string;

  before('setupApplication', async () => {

    ({ app, client } = await setupApplication());
    await signup(app, client);
    token = await login(client);
    
    await client.post('/networks/new').send(
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
        "radius": 240
      }
    ).set('Authorization', 'Bearer ' + token).expect(200);

  });
  after(async () => {
    await app.stop();
  });
  describe('map generation [gis]', () => {

    it('/networks/find without buttons', async () => {
      const resFilter = await client.get('/networks/map').query({
        geoPolygon: `{
          "type": "Polygon",
          "coordinates": [
            [
              [
                -9.633636474609375,
                38.522384090200845
              ],
              [
                -8.666839599609375,
                38.522384090200845
              ],
              [
                -8.666839599609375,
                38.886757140695906
              ],
              [
                -9.633636474609375,
                38.886757140695906
              ],
              [
                -9.633636474609375,
                38.522384090200845
              ]
            ]
          ]
        }`}).set('Authorization', 'Bearer ' + token).expect(200);

      expect(resFilter.body).to.deepEqual(
        [{
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
          "role": "admin",
          "id": 1
        }]
      );
      expect(resFilter.body.length).to.equal(1);
    });
  });
});