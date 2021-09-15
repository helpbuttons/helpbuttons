import { Client, expect } from '@loopback/testlab';
import { HelpbuttonsBackendApp } from '../..';
import { login, setupApplication } from '../helpers/authentication.helper';

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
      expect(resFilter.body.length).to.equal(1);
    });
  });
});