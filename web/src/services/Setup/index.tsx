import { Observable, tap } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { httpService } from 'services/HttpService';
import { SetupDtoOut } from './config.type';

export class SetupService {

  public static smtpTest(smtpHost: string,smtpPort: string,smtpUser: string,smtpPass: string ): Observable<string> {
    return httpService.post<SetupDtoOut>(`/setup/smtpTest`, {smtpHost, smtpPort, smtpUser, smtpPass});
  }

  public static save(config: SetupDtoOut): Observable<any> {
    return httpService.post<SetupDtoOut>("/setup/save", config).pipe();
  }
}
