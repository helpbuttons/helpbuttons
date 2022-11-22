import produce from 'immer';
import { GlobalState } from 'pages';
import { of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isHttpError } from 'services/HttpService';
import { SetupService } from 'services/Setup';
import { IConfig } from 'services/Setup/config.type';
import { UpdateEvent, WatchEvent } from 'store/Event';

export class GetConfigs implements WatchEvent {
  public constructor() {}

  public watch(state: GlobalState) {
    return SetupService.get().pipe(
      map((config) => new ConfigFound(config)),
    );
  }
}

export class ConfigFound implements UpdateEvent {
  public constructor(private config: IConfig) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.config = this.config;
    });
  }
}

export class CreateConfig implements WatchEvent {
  public constructor(
    private config: IConfig,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return SetupService.save(this.config).pipe(
      map((configData) => {
        this.onSuccess();
      }),
      catchError((error) => {
        let err = error.response;

        if (isHttpError(err) && err.statusCode === 401) {
          // Unauthorized
          this.onError('unauthorized', this.config);
        } else if (
          err.statusCode === 400 &&
          err.message === 'validation-error'
        ) {
          this.onError(' validations error');
        } else {
          throw error;
        }
        return of(undefined);
      }),
    );
  }
}

export class SmtpTest implements WatchEvent {
  public constructor(
    private smtpUrl: string,
    private onSuccess,
    private onError,
  ) {}

  
  public watch(state: GlobalState) {
    return SetupService.smtpTest(this.smtpUrl).pipe(
      map((configData) => {
        this.onSuccess();
      }),
      catchError((error) => {
        let err = error.response;

        if (isHttpError(err) && err.statusCode === 401) {
          // Unauthorized
          this.onError('unauthorized', 'lala');
        } else if (
          err.statusCode === 400 &&
          err.message === 'validation-error'
        ) {
          this.onError(' validations error');
        } else {
          throw error;
        }
        return of(undefined);
      }),
    );
  }
}
