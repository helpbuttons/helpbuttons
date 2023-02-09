import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';

import { IUser } from 'services/Users/types';
import { UserService } from 'services/Users';

import { HttpService, isHttpError } from "services/HttpService";
import { SignupRequestDto } from 'shared/dtos/auth.dto';
import { HttpStatus } from 'services/HttpService/http-status.enum';
import { GlobalState } from 'pages';

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
          new HttpService().setAccessToken(userData.token);
          return new FetchUserData(this.onSuccess, this.onError);
        }
      }),
      catchError((error) => {
        let err = error.response;

        if (isHttpError(err) && err.statusCode === HttpStatus.UNAUTHORIZED) { // Unauthorized
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
    private signupRequestDto: SignupRequestDto,
    private onSuccess,
    private onError
  ) {}

  public watch(state: GlobalState) {
    return UserService.signup(this.signupRequestDto).pipe(
      map((userData) => {
        if(userData) {
          return new FetchUserData(this.onSuccess, this.onError);
        }
      }),
      catchError((err) => {
        if (isHttpError(err) &&
            err.status === HttpStatus.BAD_REQUEST &&
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
      newState.loggedInUser = this.currentUser;
    });
  }
}

export class AddUserToKnownUsers implements UpdateEvent {
  public constructor(private newUser: IUser) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.knownUsers.push(this.newUser)
    });
  }
}



export class FindUser implements WatchEvent {
  public constructor (private username, private onSuccess = undefined, private onError = undefined) {}

  public watch(state: GlobalState) {
    return UserService.findUser(this.username).pipe(
      map(userData => new AddUserToKnownUsers(userData)),
    );
  }
}

export class Logout implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.loggedInUser = null;
    });
  }
}
