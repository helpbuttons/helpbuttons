import { Injectable } from '@nestjs/common';
import configs from '@src/config/configuration';
// import { KomootGeoProvider } from './providers/komoot';
import { PeliasProvider } from './providers/pelias';
import { HttpHelper } from '@src/shared/helpers/http.helper';
import { KomootGeoProvider } from './providers/komoot';
import { SimulateGeoProvider } from './providers/simulate';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GeoAddress } from './providers/provider.interface';
import { NetworkService } from '../network/network.service';

@Injectable()
export class GeoService {
  geoProvider = null;
  constructor(
    private readonly httpHelper: HttpHelper,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly networkService: NetworkService
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

  async search(query: string, lat: string, lon: string) {
      return this.geoProvider.searchQuery(query, lat, lon).then((results) =>
          this.searchCustom(query).then((customResults) => [...customResults, ...results]))
          .then((addresses) => this.removeDuplicateAdresses(addresses))
          .then((addresses) => this.sortAlphabetically(addresses))
          .then((addresses) => this.sortMatches(addresses, query))
  }

  async searchLimited(query: string, lat: string, lon: string) {
    return this.geoProvider.searchLimited(query, lat, lon).then((results) =>
        this.searchCustom(query).then((customResults) => [...customResults, ...results]))
        .then((addresses) => this.removeDuplicateAdresses(addresses))
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

  sortAlphabetically(addresses: GeoAddress[]) {
    return addresses.sort((addressA, addressB) => {
      return addressA.formatted.localeCompare(addressB.formatted)
    })
  }

  sortMatches(addresses: GeoAddress[], query) {
    return addresses.sort((addressA, addressB) => {
      if(addressA.formatted.toLowerCase().startsWith(query.toLowerCase()))
      {
        return -1;
      }
      return 0;
    })
  }

  removeDuplicateAdresses(addresses: GeoAddress[]): GeoAddress[] {
    const seenAddresses = new Set<string>();
    const uniqueAddresses: GeoAddress[] = [];

    for (const address of addresses) {
      if (!seenAddresses.has(address.formatted)) {
        seenAddresses.add(address.formatted);
        uniqueAddresses.push(address);
      }
    }

    return uniqueAddresses;
  }

}