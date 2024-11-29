import { Injectable } from '@nestjs/common';
import { NetworkService } from '../network/network.service';
import configs from '@src/config/configuration';
// import { KomootGeoProvider } from './providers/komoot';
import { PeliasProvider } from './providers/pelias';
import { HttpHelper } from '@src/shared/helpers/http.helper';
import { KomootGeoProvider } from './providers/komoot';
import { Response } from 'express';
import { SimulateGeoProvider } from './providers/simulate';
import { GeoAddress } from './providers/provider.interface';
import getDistance from 'geolib/es/getDistance';

function sortPlacesByProximity(centerLat: number, centerLng: number, places: GeoAddress[]): GeoAddress[] {
  return places.sort((a, b) => {
    // const distanceA = getDistance({latitude: centerLat,longitude: centerLng}, {latitude: parseFloat(a.geometry.lat), longitude: parseFloat(a.geometry.lng)});
    // const distanceB = getDistance({latitude: centerLat,longitude: centerLng}, {latitude: parseFloat(b.geometry.lat), longitude: parseFloat(b.geometry.lng)});
    
    // // console.log(distanceA-distanceB)
    // // const value = distanceA - distanceB;
    // // const distance = value > 0 ? value : value * -1;
    // return (distanceA > distanceB)
  });
}
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

  async search(latCenter: string, lngCenter: string, query: string) {
    console.log(latCenter)
    console.log(lngCenter)
    console.log('query: ' + query)
    return this.geoProvider.searchQuery(query)
    .then((geoAddresses: GeoAddress[]) => {
      console.log(geoAddresses)
      const sortedAddressDis = geoAddresses.map((address) => {
        //   console.log(`${JSON.stringify({latitude: parseFloat(latCenter),longitude: parseFloat(lngCenter)})} ${JSON.stringify({latitude: parseFloat(address.geometry.lat), longitude: parseFloat(address.geometry.lng)})}`)
          return {
            ...address,
            distance: getDistance({latitude: latCenter,longitude: lngCenter}, {latitude: parseFloat(address.geometry.lat), longitude: parseFloat(address.geometry.lng)})
          }
        })
      // const sortedAddress = sortPlacesByProximity(parseFloat(latCenter), parseFloat(lngCenter), geoAddresses)
      // ${JSON{latitude: latCenter,longitude: lngCenter}, {latitude: parseFloat(address.geometry.lat), longitude: parseFloat(address.geometry.lng)})
      // console.log()
      
      // console.log(sortedAddressDis)
      return geoAddresses;
      
      // geoAddresses.sort((a: GeoAddress,b: GeoAddress) => {
      //   a.geometry.lat, a.geometry.lng
        
      // })
    } );

  }

  async findAddress(lat: string, lng: string) {
      return this.geoProvider.getAddress({ lat: lat, lng: lng });
  }
}
