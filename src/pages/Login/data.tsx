import { map, tap, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';
import Router, { withRouter } from 'next/router';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';
import { HttpUtilsService } from "services/HttpUtilsService";
import { alertService }  from 'services/Alert/index.ts';


//Called event for login
export class LoginEvent implements WatchEvent {

  public constructor(private email: string,private password: string) {}
  public watch(state: GlobalState) {
    return UserService.login(this.email, this.password).pipe(
      map(userData => userData),
      take(1),
      tap(userData => {
        if(userData.response.token)
        new HttpUtilsService().setAccessToken("user",userData.response.token);
        Router.push({ pathname: '/', state: {} });
      }),
      catchError((error) => {
        console.log("error: ", error);
        debugger
        alertService.error('error');
        return of(error);
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
