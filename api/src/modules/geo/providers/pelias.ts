import {
  GeoAddress,
  GeoPosition,
  GeoProvider,
} from './provider.interface';
import { HttpHelper } from '@src/shared/helpers/http.helper';
export class PeliasProvider implements GeoProvider {
  apiKey = '';
  limitCountries = '';
  geoCodeHost = ''
  constructor(
    private readonly httpHelper: HttpHelper,
    _apiKey,
    _limitCountries,
    _geoCodeHost
  ) {
    console.log('starting pelias connection!')
    this.apiKey = _apiKey;
    this.limitCountries = _limitCountries;
    this.geoCodeHost = _geoCodeHost;
  }

  searchQuery(query: string): Promise<GeoAddress[]> {
    return this.queryGeo(query).then((res) => {
      return res.data.features.map((item) => this.hydratePlace(item));
    });
  }
  GEOCODE_HOST
  queryGeo(query): Promise<any> {
    let url = `${this.geoCodeHost}v1/autocomplete?api_key=${this.apiKey}&text=${query}&size=15`;
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
      `${this.geoCodeHost}v1/reverse?api_key=${this.apiKey}&point.lat=${lat}&point.lon=${lng}`,
    );
  }

  hydratePlace(place: any): GeoAddress {
    const placeProperties = place.properties;
    return {
      formatted: place.properties.label,
      formatted_city: `${placeProperties.region}, ${placeProperties.country}`,
      geometry: {
        lat: place.geometry.coordinates[1],
        lng: place.geometry.coordinates[0],
      },
      id: place.osmid,
    };
  }

}
