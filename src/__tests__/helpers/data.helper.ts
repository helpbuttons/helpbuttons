import {
  Client,
} from '@loopback/testlab';

export async function createNetwork(client: Client, token: string) {
    const res = await client.post('/networks/new').send(
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
        "radius": 240,
        "friendNetworks": [1, 2]
      }
    ).set('Authorization', 'Bearer ' + token);
  
    return res.body.id;
  }
  
  
  export async function createButton(networkId: number, client: Client, token: string) {
    const res = await client.post('/buttons/new').query({ networkId: networkId }).send({
      "name": "Perritos en adopcion",
      "description": "button for animal rescue",
      "geoPlace": {
        "coordinates": [100, 0],
        "type": "Point"
      },
      "tags": ["Animales", "Perritos", "Adopcion"],
      "type": "offer"
    }
    ).set('Authorization', 'Bearer ' + token);
  
    return res.body.id;
  }