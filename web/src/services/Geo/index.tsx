import { Observable } from "rxjs";
import { httpService } from "services/HttpService";

export class GeoService {
  
    public static find(address: string): Observable<any> {
        const path = `//${process.env.hostName}:${process.env.webPort}/geoapify/v1/geocode/autocomplete?text=${address}&format=json&apiKey=${process.env.mapifyApiKey}`
        return httpService.get(path);
      }
}