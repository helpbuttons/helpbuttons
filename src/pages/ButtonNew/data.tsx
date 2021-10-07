import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { ButtonService } from 'services/Buttons';
import IButton from 'services/Buttons/types';
import { alertService } from 'services/Alert';

//Called event for new user signup
export class CreateButtonEvent implements WatchEvent {
  public constructor(private button : IButton, private token : string, private networkId : string) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.button, this.token, this.networkId).pipe(
            catchError((error) => {
              console.log("error: ", error);
              error = alertService.error;
              return of(error);
            })
    )
  }
}
