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
    this.apiKey = _apiKey;
    this.limitCountries = _limitCountries;
    this.geoCodeHost = _geoCodeHost;
  }

  // focus.point
  searchQuery(query: string, lat: string, lon: string): Promise<GeoAddress[]> {
    return this.queryGeo(`${query}&layers=venue,address,localadmin,locality,borough&focus.point.lat=${lat}&focus.point.lon=${lon}`).then((res) => {
      return res.data.features.map((item) => this.hydratePlace(item));
    });
  }
  
  searchLimited(query: string, lat: string, lon: string): Promise<GeoAddress[]> {
    return this.queryGeo(`${query}&layers=localadmin,locality,borough&focus.point.lat=${lat}&focus.point.lon=${lon}`).then((res) => {
      return res.data.features.map((item) => this.hydratePlace(item, true));
    });
  }

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

  getLimitedAddress(position: GeoPosition): Promise<GeoAddress> {
    return this.reverseGeo(position.lat, position.lng, true).then((res) =>
      this.hydratePlace(res.data.features[0], true),
    );
  }

  reverseGeo(lat, lng, limited = false): Promise<any> {
    const url =
      `${this.geoCodeHost}v1/reverse?api_key=${this.apiKey}&point.lat=${lat}&point.lon=${lng}${limited ? '&layers=-address,-venue' : ''}`;
    return this.httpHelper.get(url);
  }

  hydratePlace(place: any, limited = false): GeoAddress {
    const placeProperties = place.properties;
    let label = placeProperties.label.replace(placeProperties.region_a, placeProperties.region)
    if(limited)
    {
      label = `${placeProperties.localadmin ? placeProperties.localadmin+', ' : ''}${placeProperties.region ? placeProperties.region+', ' : ''}${placeProperties.country ? placeProperties.country : ''}`
    }
    
    return {
      formatted: label,
      geometry: {
        lat: place.geometry.coordinates[1],
        lng: place.geometry.coordinates[0],
      },
      id: place.osmid,
    };
  }

}
