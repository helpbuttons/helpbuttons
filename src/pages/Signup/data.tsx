import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { UserData } from 'services/Users/types';


export class SignupEvent implements WatchEvent {
  public watch(state: GlobalState) {
    return UserService.signup().pipe(
      map((userData) => new UserSignupEvent(userData))
    )
  }
}


export class UserSignupEvent implements UpdateEvent {
  public constructor(private userData: UserData) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.login.userData = this.userData;
    });
  }
}
