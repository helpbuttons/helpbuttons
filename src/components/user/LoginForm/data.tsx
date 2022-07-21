import { of } from 'rxjs';
import { map, tap, take, catchError } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { SetCurrentUser } from 'pages/Common/data';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';
import { HttpService } from "services/HttpService";
import { errorService } from 'services/Error';

export class Login implements WatchEvent {
  public constructor (private email: string,
                      private password: string,
                      private onSuccess,
                      private onError) {}

  public watch(state: GlobalState) {
    return UserService.login(this.email, this.password).pipe(
      map(userData => {
        if (userData) {
          return new FetchUserData(this.onSuccess, this.onError);
        } else {
          throw Error("Login incorrect");
        }
      }),
      catchError((err) => {
        if (this.onError) {
          this.onError(err);
        }
        return of(undefined);
      })
    )
  };
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


//Called event for login
export class LoginFormEvent implements WatchEvent {

  public constructor(private email: string, private password: string, private setValidationErrors) {}

  public watch(state: GlobalState) {
    return UserService.login(this.email, this.password).pipe(
      map(userData => userData),
      take(1),
      tap(userData => {
        if(userData.response.token)
        new HttpService().setAccessToken("user",userData.response.token);
        Router.push({ pathname: '/', state: {} });
      }),
      catchError((error) => {
        if (error.response && error.response.validationErrors)
        {
          this.setValidationErrors(error.response.validationErrors)
        }
        return errorService.handle(error);
      }),
    )
  }
}


//Called event for session update values
export class UserLoginEvent implements UpdateEvent {
  public constructor(private userData: IUser) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.user = this.userData;
    });
  }
}
