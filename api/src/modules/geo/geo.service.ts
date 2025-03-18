import { Injectable } from '@nestjs/common';
import { NetworkService } from '../network/network.service';
import configs from '@src/config/configuration';
// import { KomootGeoProvider } from './providers/komoot';
import { PeliasProvider } from './providers/pelias';
import { HttpHelper } from '@src/shared/helpers/http.helper';
import { KomootGeoProvider } from './providers/komoot';
import { Response } from 'express';
import { SimulateGeoProvider } from './providers/simulate';

@Injectable()
export class GeoService {
  geoProvider = null;
  constructor(
    private readonly networkService: NetworkService,
    private readonly httpHelper: HttpHelper
  ) {
    const geoCodeApiKey = configs().GEOCODE_APY_KEY;
    const geoSimulate = configs().GEO_SIMULATE;
    if(geoSimulate)
    {
      this.geoProvider = new SimulateGeoProvider()
    }else if (geoCodeApiKey) {
      const geoCodeLimitCountries = configs().GEOCODE_LIMIT_COUNTRIES;
      const geoCodeHost = configs().GEOCODE_HOST;
      this.geoProvider = new PeliasProvider(
        this.httpHelper,
        geoCodeApiKey,
        geoCodeLimitCountries,
        geoCodeHost
      );
    } else {
      this.geoProvider = new KomootGeoProvider(this.httpHelper);
    }
  }

  async search(query: string) {
    return this.geoProvider.searchQuery(query);
  }

  async searchLimited(query: string) {
    return this.geoProvider.searchLimited(query);
  }

  async findAddress(lat: string, lng: string) {
      return this.geoProvider.getAddress({ lat: lat, lng: lng });
  }

  async findAddressLimited(lat: string, lng: string) {
    return this.geoProvider.getLimitedAddress({ lat: lat, lng: lng });
  }
  
}
