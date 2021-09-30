import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';
import { alertService } from 'services/Alert';
import { userSubject } from 'services/Users';


//Called event for login
export class LoginEvent implements WatchEvent {
  public constructor(private email: string,private password: string) {}
  public watch(state: GlobalState) {
    debugger
    return UserService.login(this.email, this.password).pipe(
      map((userData) => new UserLoggedEvent(userData)),
      tap((userData:any) => {
        debugger
        let response = JSON.parse(userData)
        setAccessToken('userToken',response);
        // localStorage.setItem('userT', JSON.stringify(userData.response.token))
      }),
      catchError((error) => {
        console.log("error: ", error);
        error = alertService.error;
        return of(error);
      })
    )
  }
}


//Called event for session update values
export class UserLoggedEvent implements UpdateEvent {
  public constructor(private userData: IUser) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.currentUser = this.userData;
    });
  }
}
