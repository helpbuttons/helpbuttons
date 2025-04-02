import produce from 'immer';
import { GlobalState, store } from 'state';
import { of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isHttpError } from 'services/HttpService';
import { NetworkService } from 'services/Networks';
import { SetupService } from 'services/Setup';
import { SetupDtoOut } from 'services/Setup/config.type';
import { UserService } from 'services/Users';
import { SignupRequestDto } from 'shared/dtos/auth.dto';
import { HttpStatus } from 'shared/types/http-status.enum';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { FetchUserData } from './Profile';
import { alertService } from 'services/Alert';
import { useEffect, useRef } from 'react';
import { useStore } from 'state';
import dconsole from 'shared/debugger';


export const useConfig = (_config, onError) => {
  const fetchingConfig = useRef(false)
  useEffect(() => {
    if(!_config && !fetchingConfig.current)
    {
      fetchingConfig.current = true
      store.emit(new GetConfig(() => dconsole.log('got config!'), onError))
    }else if(_config){
      store.emit(new ConfigFound(_config))
    }
  }, [_config])
  return useStore(
    store,
    (state: GlobalState) => state.config,
  );;
}
export class GetConfig implements WatchEvent {
  public constructor(private onSuccess, private onError) {}

  public watch(state: GlobalState) {
    return NetworkService.get().pipe(
      map((config :SetupDtoOut) => {
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
          this.onError('not-found');
        } else if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.BAD_REQUEST
        ) {
          this.onError('nosysadminconfig');
        }else if (
            isHttpError(err) &&
            err.statusCode === HttpStatus.SERVICE_UNAVAILABLE
          ) {
            alertService.error('backend error: ' + err.message)
        } else if (
          error.status === HttpStatus.INTERNAL_SERVER_ERROR
        ) {
          this.onError('nobackend');
        } else {
          console.log(error)
          throw error;
        }
        return of(undefined);
      })
    );
  }
}

export class ConfigFound implements UpdateEvent {
  public constructor(private config: SetupDtoOut) {
  }

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.config = this.config;
    });
  }
}

export class CreateConfig implements WatchEvent {
  public constructor(
    private config: SetupDtoOut,
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
    private smtpHost: string,
    private smtpPort: string,
    private smtpUser: string,
    private smtpPass: string,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return SetupService.smtpTest(this.smtpHost,this.smtpPort,this.smtpUser,this.smtpPass ).pipe(
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
      map((userData) => {
        if(userData) {
          return new FetchUserData(this.onSuccess, this.onError);
        }
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
        } else if(err.statusCode == HttpStatus.NOT_ACCEPTABLE) {          
          this.onError(err)
        }else{
          throw error;
        }
        return of(undefined);
      }),
    );
  }
}

export class setConfig implements UpdateEvent {
  public constructor(private config) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.config = this.config;
    });
  }
}
