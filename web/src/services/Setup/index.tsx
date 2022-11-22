import { Icon } from 'leaflet';
import { Observable, tap } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { httpService } from 'services/HttpService';
import { IConfig } from './config.type';

export class SetupService {

  public static get(): Observable<IConfig | undefined> {
    return httpService.get<IConfig>("/config");
  }

  public static smtpTest(smtpUrl: string): Observable<string> {
    return httpService.post<IConfig>(`/setup/smtpTest`, {smtpUrl: smtpUrl});
  }

  public static save(config: IConfig): Observable<any> {
    console.log(config);
    return httpService.post<IConfig>("/setup/save", config).pipe();
  }
}
