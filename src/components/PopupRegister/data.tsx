import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from '../store/Event';
import { UserDataService } from '../../services/Users';
import { User } from '../../services/Users/types';


export interface UserSignupState {
  email: string;
  user: User;
}


export const signupInitial = {
  email: "(empty)",
  user: null,
}


export class RegisterUser implements WatchEvent {

  public watch() {
    return UserService.signup()
    )
  }
}


export class UserRegistered implements UpdateEvent {
  public constructor(private user: User) {}

  public update(state: UserSignupState) {
    return produce(state, newState => {
      newState.Users.user = this.user;
    });
  }
}
