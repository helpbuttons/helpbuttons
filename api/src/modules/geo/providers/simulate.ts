import {
  GeoAddress,
  GeoPosition,
  GeoProvider,
} from './provider.interface';

export class SimulateGeoProvider implements GeoProvider {
  constructor() {}

  searchQuery(query: string): Promise<GeoAddress[]> {
    return this.queryGeo(query);
  }

  queryGeo(query): Promise<any> {
    console.log(`simulating: getting places for query '${query}'`);
    //   setTimeout(() => {
    const places = [
      {
        formatted: 'Eiffel Tower, Paris, France',
        formatted_city: 'Paris, France',
        geometry: {
          lat: '48.8584',
          lng: '2.2945',
        },
        id: '1',
      },
      {
        formatted: 'Colosseum, Rome, Italy',
        formatted_city: 'Rome, Italy',
        geometry: {
          lat: '41.8902',
          lng: '12.4922',
        },
        id: '2',
      },
      {
        formatted: 'Brandenburg Gate, Berlin, Germany',
        formatted_city: 'Berlin, Germany',
        geometry: {
          lat: '52.5163',
          lng: '13.3777',
        },
        id: '3',
      },
      {
        formatted: 'Buckingham Palace, London, UK',
        formatted_city: 'London, UK',
        geometry: {
          lat: '51.5014',
          lng: '-0.1419',
        },
        id: '4',
      },
      {
        formatted: 'Sagrada Família, Barcelona, Spain',
        formatted_city: 'Barcelona, Spain',
        geometry: {
          lat: '41.4036',
          lng: '2.1744',
        },
        id: '5',
      },
    ];
    return Promise.resolve(
      places.filter((place) => place.formatted.search(query) > -1),
    );
    //   }, 10);
    // });
  }

  getAddress(position: GeoPosition): Promise<GeoAddress> {
    console.log(
      `simulating: getting place for position '${JSON.stringify(
        position,
      )}'`,
    );
    return Promise.resolve({
      formatted: 'Sagrada Família, Barcelona, Spain',
      formatted_city: 'Paris, France',
      geometry: { lat: '41.4036', lng: '2.1744' },
      id: '5',
    });
  }
}
