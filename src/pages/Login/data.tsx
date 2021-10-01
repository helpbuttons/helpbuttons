import { map, tap, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';
import Router, { withRouter } from 'next/router';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';
import { alertService } from 'services/Alert';
import { userObs } from 'services/Users';
import { HttpUtilsService } from "services/HttpUtil";

//Called event for login
export class LoginEvent implements WatchEvent {

  public constructor(private email: string,private password: string) {}
  public watch(state: GlobalState) {
    return UserService.login(this.email, this.password).pipe(
      map(userData => userData),
      take(1),
      catchError(error => of({ error: true, message: `Error ${error.status}` })),
      tap(userData => {
        debugger
        new HttpUtilsService().setAccessToken("user",userData.response.token);
        console.log(localStorage.getItem('user'));
        Router.push({ pathname: '/', state: {} });
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
