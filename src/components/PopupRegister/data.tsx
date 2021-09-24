import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from '../store/Event';
import { UserDataService } from '../../services/Users';
import { User } from '../../services/Users/types';


export interface UserSignupState {
  email: string;
  password: string;
  user: User;
}


export const signupInitial = {
  email: "(empty)",
  password: "1234",
  user: null,
}

export function getValueFromInputEvent(event: Observable<InputEvent>): Observable<string> {

  return event.pipe(
    tap(event => console.log("event.target", event.target)),
    map((event: InputEvent) => (event.target as HTMLInputElement).value)
  );

}

// export class RegisterUser implements WatchEvent {
//
//   public watch() {
//
//
//     return UserService.signup()
//
//     )
//   }
// }


export class UserRegistered implements UpdateEvent {
  public constructor(private user: User) {}

  public update(state: UserSignupState) {
    return produce(state, newState => {
      newState.Users.user = this.user;
    });
  }
}
