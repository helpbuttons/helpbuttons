import { Icon } from 'leaflet';
import { Observable, tap } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { httpService } from 'services/HttpService';
import { SetupDtoOut } from './config.type';

export class SetupService {

  public static smtpTest(smtpUrl: string): Observable<string> {
    return httpService.post<SetupDtoOut>(`/setup/smtpTest`, {smtpUrl: smtpUrl});
  }

  public static save(config: SetupDtoOut): Observable<any> {
    return httpService.post<SetupDtoOut>("/setup/save", config).pipe();
  }
}
