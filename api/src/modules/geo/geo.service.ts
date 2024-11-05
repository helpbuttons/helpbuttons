import { Injectable } from '@nestjs/common';
import { NetworkService } from '../network/network.service';
import configs from '@src/config/configuration';
// import { KomootGeoProvider } from './providers/komoot';
import { PeliasProvider } from './providers/pelias';
import { HttpHelper } from '@src/shared/helpers/http.helper';
import { KomootGeoProvider } from './providers/komoot';
import { Response } from 'express';

@Injectable()
export class GeoService {
  geoProvider = null;
  constructor(
    private readonly networkService: NetworkService,
    private readonly httpHelper: HttpHelper
  ) {
    const geoCodeApiKey = configs().GEOCODE_APY_KEY;
    const geoCodeLimitCountries = configs().GEOCODE_LIMIT_COUNTRIES;
    if (geoCodeApiKey) {
      this.geoProvider = new PeliasProvider(
        this.httpHelper,
        geoCodeApiKey,
        geoCodeLimitCountries,
      );
    } else {
      this.geoProvider = new KomootGeoProvider(this.httpHelper);
    }
  }

  async search(query: string) {
    return this.geoProvider.searchQuery(query);
  }

  async findAddress(lat: string, lng: string, response: Response) {
      return this.geoProvider.getAddress({ lat: lat, lng: lng });
  }
}
