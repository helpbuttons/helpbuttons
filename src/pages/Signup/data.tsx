import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';


export class SignupEvent implements WatchEvent {
  public constructor(private email: string,private password: string) {}
  public watch(state: GlobalState) {
    return UserService.signup(this.email, this.password).pipe(
      map((userData) => new UserSignupEvent(userData))
    )
  }
}


export class UserSignupEvent implements UpdateEvent {
  public constructor(private userData: IUser) {}
  public update(state: GlobalState) {
    debugger
    return produce(state, newState => {
      newState.user = this.userData;
    });
  }
}
