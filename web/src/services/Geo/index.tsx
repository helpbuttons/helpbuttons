import { Observable, of } from 'rxjs';
import { httpService } from 'services/HttpService';
const opencage = require('opencage-api-client');
export class GeoService {
  public static find(address: string): Observable<any> {
    return this.findOpenCage(address);
  }
  public static findGeoApify(address: string): Observable<any> {
    const path = `/geoapify/v1/geocode/autocomplete?text=${address}&format=json&apiKey=${process.env.mapifyApiKey}`;
    return httpService.get(path);
  }

  public static findOpenCage(address: string): Observable<any> {
    const options = JSON.parse(address);
    if (!options.address || address.length < 2) {
      return of(undefined);
    }
    return opencage
      .geocode({
        q: options.address,
        key: options.apikey,
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log('Error', error.message);
        if (error.status.code === 402) {
          console.log('hit free trial daily limit');
          console.log(
            'become a customer: https://opencagedata.com/pricing',
          );
        }
      });
  }
}
