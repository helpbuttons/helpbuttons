import produce from 'immer';
import { GlobalState, store } from 'pages';
import { of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isHttpError } from 'services/HttpService';
import { HttpStatus } from 'services/HttpService/http-status.enum';
import { SetupService } from 'services/Setup';
import { IConfig } from 'services/Setup/config.type';
import { UserService } from 'services/Users';
import { SignupRequestDto } from 'shared/dtos/auth.dto';
import { UpdateEvent, WatchEvent } from 'store/Event';

export class GetConfig implements WatchEvent {
  public constructor(private onSuccess, private onError) {}

  public watch(state: GlobalState) {
    return SetupService.get().pipe(
      map((config :IConfig) => {
        store.emit(new ConfigFound(config))
        this.onSuccess(config)
      }),
      catchError((error) => {
        let err = error.response;
        if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.NOT_FOUND
        ) {
          // Unauthorized
          this.onError('unauthorized');
        } else if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.BAD_REQUEST
        ) {
          this.onError('nosysadminconfig');
        }else if (
            isHttpError(err) &&
            err.statusCode === HttpStatus.SERVICE_UNAVAILABLE
          ) {
            this.onError('nomigrations');
        } else {
          throw error;
        }
        return of(undefined);
      })
    );
  }
}

export class ConfigFound implements UpdateEvent {
  public constructor(private config: IConfig) {
  }

  public update(state: GlobalState) {
    return produce(state, newState => {
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
        this.onSuccess(configData);
      }),
      catchError((error) => {
        let err = error.response;
        if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.UNAUTHORIZED
        ) {
          // Unauthorized
          this.onError('unauthorized', this.config);
        } else if (
          isHttpError(err) && err.statusCode === HttpStatus.BAD_REQUEST &&
          err.message === 'validation-error'
        ) {
          this.onError(' validations error');
        } else if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.SERVICE_UNAVAILABLE
        ) {
          this.onError(err, this.config);
        } else if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.CONFLICT
        ) {
          this.onError(err, this.config);
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
      map(() => {
        this.onSuccess();
      }),
      catchError((error) => {
        let err = error.response;
        if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.UNAUTHORIZED
        ) {
          // Unauthorized
          this.onError('unauthorized');
        } else if (
          err.statusCode === 400 &&
          err.message === 'validation-error'
        ) {
          this.onError(' validations error');
        } else if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.SERVICE_UNAVAILABLE
        ) {
          this.onError(error);
        } else {
          throw error;
        }
        return of(undefined);
      }),
    );
  }
}


export class CreateAdmin implements WatchEvent {
  public constructor(
    private signupRequestDto : SignupRequestDto,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return UserService.signup(this.signupRequestDto).pipe(
      map((configData) => {
        this.onSuccess(configData);
      }),
      catchError((error) => {
        let err = error.response;
        if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.UNAUTHORIZED
        ) {
          // Unauthorized
          this.onError('unauthorized');
        } else if (
          isHttpError(err) && err.statusCode === HttpStatus.BAD_REQUEST &&
          err.message === 'validation-error'
        ) {
          this.onError(err);
        } else if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.SERVICE_UNAVAILABLE
        ) {
          this.onError(err);
        } else if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.CONFLICT
        ) {
          this.onError(err);
        } else {
          ('oi')
          throw error;
        }
        return of(undefined);
      }),
    );
  }
}

