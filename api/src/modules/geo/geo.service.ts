
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { configFileName } from '@src/shared/helpers/config-name.const';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware';
import { ErrorName } from '@src/shared/types/error.list';
import { NetworkService } from '../network/network.service';

const config = require(`../../..${configFileName}`);

@Injectable()
export class GeoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly networkService: NetworkService
  ) {}

  async search(address: string) {
    try{
        return this.komoot(address);
        // return this.geokeo(address);
    }catch(err)
    {
        return []
    }
  }

  async geokeo(address: string) {
    const url = `https://geokeo.com/geocode/v1/search.php?q=${address}&api=${config.geokeo}`;
    return firstValueFrom(this.httpService.get(url)).then((result) => {
        // @ts-ignore
        if(!result.data.results)
        {
            throw new CustomHttpException(ErrorName.geoCodingError)
        }
        let addressesFound = []
        // @ts-ignore
         result.data.results.map((place) => {
            const name = place.address_components.street ? place.address_components.street : place.address_components.name
            addressesFound.push({formatted: `${name}, ${place.address_components.district}, ${place.address_components.country}`, geometry: place.geometry})
        })
        return addressesFound
    })
  }

  async opencage(address: string) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${config.mapifyApiKey}`
    const {data} = await firstValueFrom(this.httpService.get(url))
    return data;
  }

  async komoot(address: string)
  {
    return await this.networkService.findDefaultNetwork().then(async (network) => {
        let addressesFound = []
        // @ts-ignore
        const url = encodeURI(`https://photon.komoot.io/api/?q=${address}&lat=${network.exploreSettings.center[0]}&lon=${network.exploreSettings.center[1]}&limit=5`)
        return await firstValueFrom(this.httpService.get(url)).then((result) => {
            if(!result.data.features){
                return []
            }
            result.data.features.map((place) => {
              const name = place.properties.name ? `${place.properties.name}`: '';
              const city = place.properties.city ? `, ${place.properties.city}`: '';
              const country = place.properties.country ? `, ${place.properties.country}`: '';
                addressesFound.push({formatted: `${name}${city}${country}`, geometry: {lat: place.geometry.coordinates[1],lng:place.geometry.coordinates[0]}, id: place.osmid})
            })
            return addressesFound;
        })
    }).catch((err) => {
      throw new CustomHttpException(ErrorName.geoCodingError)
    });
    
    
  }
  
}
