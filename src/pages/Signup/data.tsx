import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';

//Current user session object
export interface CurrentUserState {
  username: string,
  email: string,
  realm: string,
  roles: [],
}

//No logged user  values
export const userInitial = {
  username: "",
  email: "",
  realm: "",
  roles: [],
}

//Called event for new user signup
export class SignupEvent implements WatchEvent {
  public constructor(private email: string,private password: string) {}
  public watch(state: GlobalState) {
    return UserService.signup(this.email, this.password).pipe(
      map((userData) => new UserSignupEvent(userData))
    )
  }
}

//Called event for session update values
export class UserSignupEvent implements UpdateEvent {
  public constructor(private userData: IUser) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.currentUser = this.userData;
    });
  }
}
