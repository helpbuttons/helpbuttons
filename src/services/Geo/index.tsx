import { Observable } from "rxjs";
import { httpService } from "services/HttpService";
const apiKey = 'be3c17ac1f2d4c5198445cedeafc9ca7';
export class GeoService {
    
    public static find(address: string): Observable<any> {
        return httpService.get(`${process.env.NEXT_PUBLIC_GEO_URI}v1/geocode/autocomplete?text=${address}&format=json&apiKey=${apiKey}`);
      }
}