import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { IUser } from 'services/Users/types';
import { UserService } from 'services/Users';

import { HttpService, isHttpError } from "services/HttpService";

export interface UsersState {
  currentUser: IUser;
}

export const usersInitial = {
  currentUser: undefined,
}

export class Login implements WatchEvent {
  public constructor (
    private email: string,
    private password: string,
    private onSuccess,
    private onError
  ) {}

  public watch(state: GlobalState) {
    return UserService.login(this.email, this.password).pipe(
      map(userData => {
        if (userData) {
          return new FetchUserData(this.onSuccess, this.onError);
        }
      }),
      catchError((err) => {
        if (isHttpError(err) && err.status === 401) { // Unauthorized
          this.onError("login-incorrect");
        } else {
          throw err;
        }
        return of(undefined);
      })
    )
  };
}

export class SignupUser implements WatchEvent {
  public constructor(
    private email: string,
    private password: string,
    private name: string,
    private onSuccess,
    private onError
  ) {}

  public watch(state: GlobalState) {
    return UserService.signup(this.email, this.password, this.name).pipe(
      map((userData) => {
        if(userData) {
          return new FetchUserData(this.onSuccess, this.onError);
        }
      }),
      catchError((err) => {
        if (isHttpError(err) &&
            err.status === 400 &&
            err.response.message === "email-already-exists") {
          this.onError("email-already-exists");
        } else {
          throw err;
        }
        return of(undefined);
      })
    );
  }
}

export class FetchUserData implements WatchEvent {
  public constructor (private onSuccess = undefined, private onError = undefined) {}

  public watch(state: GlobalState) {
    return UserService.whoAmI().pipe(
      tap(userData => {
        if (userData && this.onSuccess) {
          this.onSuccess();
        }
      }),
      map(userData => new SetCurrentUser(userData)),
      catchError((err) => {
        if (this.onError) {
          this.onError(err);
        }
        return of(undefined);
      }),
    );
  }
}

export class SetCurrentUser implements UpdateEvent {
  public constructor(private currentUser: IUser) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.users.currentUser = this.currentUser;
    });
  }
}

