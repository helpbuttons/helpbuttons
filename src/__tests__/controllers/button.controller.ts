import {Client, expect} from '@loopback/testlab';
import {HelpbuttonsBackendApp} from '../..';
import {setupApplication} from '../helpers/test-helper';

describe('ButtonController (integration)', () => {
    let app: HelpbuttonsBackendApp;
    let client: Client;
  
    before('setupApplication', async () => {
      ({app, client} = await setupApplication());
    });
    after(async () => {
        await app.stop();
      });
    
      it('/buttons/new', async () => {
        const res = await client.post('/buttons/new').send({
          "name": "button name",
          "type": "exchange",
          "tags": [
            "onetag"
          ],
          "description": "description of da button",
          "latitude": 3.12321321,
          "longitude": 5.32421321,
          "networks": [
            "network_test"
          ]
        }).expect(200);
        expect(res.body).to.containEql({
          id: 1,
          name: 'button name',
          type: 'exchange',
          tags: ['onetag'],
          description: 'description of da button',
          latitude: 3.12321321,
          longitude: 5.32421321,
          networks: ['network_test']
        });
      });
      
});