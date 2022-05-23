import { map, tap, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';
import Router, { withRouter } from 'next/router';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';
import { alertService } from 'services/Alert';

//Called event for new user signup
export class SignupEvent implements WatchEvent {
  public constructor(private email: string,private password: string) {}
  public watch(state: GlobalState) {
    return UserService.signup(this.email, this.password).pipe(
      map((userData) => userData),
      take(1),
      tap(userData => {
        // if(userData.response.verificationToken)
        // Router.push({ pathname: 'localhost:3000' + userData.response.verificationToken.toString(), state: {} });
        // window.location.assign('localhost:3000' + userData.response.verificationToken.toString());
        alertService.info('You signed up! Now visit this link to activate');
        Router.push({ pathname: '/', state: {} });
      }),
      catchError((error) => {
        if(error.response.error.details) {
          alertService.error(error.response.error.details[0].message);
        } else {
          alertService.error(error.response.error.message);
        }
        return of(error);
      }),
    )
  }
}

//Called event for session update values
export class UserSignupEvent implements UpdateEvent {
  public constructor(private userData: IUser) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.user = this.userData;
    });
  }
}
