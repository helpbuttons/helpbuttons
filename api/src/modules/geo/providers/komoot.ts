import { HttpException, HttpStatus } from '@nestjs/common';
import {
  GeoAddress,
  GeoPosition,
  GeoProvider,
} from './provider.interface.js';
import { HttpHelper } from '@src/shared/helpers/http.helper.js';
import { Response } from 'express';

export class KomootGeoProvider implements GeoProvider {
  constructor(private readonly httpHelper: HttpHelper) {}

  searchQuery(query: string): Promise<GeoAddress[]> {
    return this.queryGeo(query).then((res) => {
      return res.data.features.map((item) => this.hydratePlace(item));
    });
  }

  queryGeo(query): Promise<any> {
    let url = `https://photon.komoot.io/api/?q=${query}`;
    return this.httpHelper.get(url)
  }

  getAddress(position: GeoPosition): Promise<GeoAddress> {
    return this.reverseGeo(position.lat, position.lng).then((res) => {
      if (res?.data?.features[0]) {
        return this.hydratePlace(res.data.features[0]);
      }
    });
  }

  reverseGeo(lat: string, lng: string): Promise<any> {
    const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
    return this.httpHelper.get(url).catch((err) => {
      throw new HttpException('error calling komoot api', HttpStatus.FAILED_DEPENDENCY)
    });
  }

  hydratePlace(place: any): GeoAddress {
    try {
      const name = place.properties.name
        ? `${place.properties.name}, `
        : '';
      const street = place.properties.street
        ? `${place.properties.street}, `
        : '';
      const housenumber = place.properties.housenumber
        ? `${place.properties.housenumber}, `
        : '';
      const city = place.properties.city
        ? `${place.properties.city}, `
        : '';
      const country = place.properties.country
        ? `${place.properties.country}`
        : '';
      return {
        formatted: `${name}${street}${housenumber}${city}${country}`,
        // formatted_city: `${city}${country}`,
        geometry: {
          lat: place.geometry.coordinates[1],
          lng: place.geometry.coordinates[0],
        },
        id: place.osmid,
      };
    } catch (err) {
      console.log(err);
      console.log(place);
      throw new HttpException('cant handle place', HttpStatus.PARTIAL_CONTENT)
    }
  }
}
