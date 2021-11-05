import { map, tap, take, catchError } from 'rxjs/operators';
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
            map(buttonData => buttonData),
            take(1),
            tap(buttonData => {
              alertService.info('Has creado un botón' + buttonData.response.id.toString());
            }),
            catchError((error) => {
              console.log("error: ", error.message);
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
