import { Injectable } from '@nestjs/common';
import configs from '@src/config/configuration';
// import { KomootGeoProvider } from './providers/komoot';
import { PeliasProvider } from './providers/pelias';
import { HttpHelper } from '@src/shared/helpers/http.helper';
import { KomootGeoProvider } from './providers/komoot';
import { SimulateGeoProvider } from './providers/simulate';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class GeoService {
  geoProvider = null;
  constructor(
    private readonly httpHelper: HttpHelper,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    const geoCodeApiKey = configs().GEOCODE_APY_KEY;
    const geoSimulate = configs().GEO_SIMULATE;
    if (geoSimulate) {
      this.geoProvider = new SimulateGeoProvider()
    } else if (geoCodeApiKey) {
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
    return this.geoProvider.searchQuery(query).then((results) =>
      this.searchCustom(query).then((customResults) => [...customResults, ...results])
    );
  }

  async searchLimited(query: string) {
    return this.geoProvider.searchLimited(query).then((results) =>
      this.searchCustom(query).then((customResults) => [...customResults, ...results])
    );
  }

  async findAddress(lat: string, lng: string) {
    return this.geoProvider.getAddress({ lat: lat, lng: lng });
  }

  async findAddressLimited(lat: string, lng: string) {
    return this.geoProvider.getLimitedAddress({ lat: lat, lng: lng });
  }

  async searchCustom(query: string) {
    return this.entityManager.query(
      `SELECT * FROM custom_places WHERE address LIKE $1`,
      [`%${query}%`]
    )
      .then((results) => results.map((customPlace) => { return { formatted: customPlace.address, geometry: { lat: customPlace.latitude, lng: customPlace.longitude } } }))
  }
}