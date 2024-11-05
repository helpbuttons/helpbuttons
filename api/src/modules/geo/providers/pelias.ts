import {
  GeoAddress,
  GeoPosition,
  GeoProvider,
} from './provider.interface';
import { HttpHelper } from '@src/shared/helpers/http.helper';
export class PeliasProvider implements GeoProvider {
  apiKey = '';
  limitCountries = '';
  constructor(
    private readonly httpHelper: HttpHelper,
    _apiKey,
    _limitCountries,
  ) {
    this.apiKey = _apiKey;
    this.limitCountries = _limitCountries;
  }

  searchQuery(query: string): Promise<GeoAddress[]> {
    return this.queryGeo(query).then((res) => {
      return res.data.features.map((item) => this.hydratePlace(item));
    });
  }

  queryGeo(query): Promise<any> {
    let url = `https://api.geocode.earth/v1/autocomplete?api_key=${this.apiKey}&text=${query}&size=5`;
    if (this.limitCountries.length > 0) {
      url = `${url}&boundary.country=${this.limitCountries}`;
    }
    return this.httpHelper.get(url);
  }

  getAddress(position: GeoPosition): Promise<GeoAddress> {
    return this.reverseGeo(position.lat, position.lng).then((res) =>
      this.hydratePlace(res.data.features[0]),
    );
  }

  reverseGeo(lat, lng): Promise<any> {
    return this.httpHelper.get(
      `https://api.geocode.earth/v1/reverse?api_key=${this.apiKey}&point.lat=${lat}&point.lon=${lng}`,
    );
  }

  hydratePlace(place: any): GeoAddress {
    const city = place.properties.city
      ? `${place.properties.city}, `
      : '';
    const country = place.properties.country
      ? `${place.properties.country}`
      : '';
    return {
      formatted: place.properties.label,
      formatted_city: `${city}${country}`,
      geometry: {
        lat: place.geometry.coordinates[1],
        lng: place.geometry.coordinates[0],
      },
      id: place.osmid,
    };
  }

  emptyPlace() {
    return {
      formatted: 'Unknown place',
      formatted_city: 'Unknown place',
      geometry: null,
      id: null,
    } as GeoAddress;
  }
}
