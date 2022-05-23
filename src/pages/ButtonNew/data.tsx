import { map, tap, take, catchError } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { ButtonService } from 'services/Buttons';
import IButton from 'services/Buttons/types';
import { alertService } from 'services/Alert';
import { errorService } from 'services/Error';

//Called event for new user signup
export class CreateButtonEvent implements WatchEvent {
  public constructor(private button : IButton, private token : string, private networkId : string) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.button, this.token, this.networkId).pipe(
            tap(buttonData => {
              alertService.info('Has creado un botón' + buttonData.response.id.toString());
            }),
            catchError((error) => {
              // console.log(error)
              return errorService.handle(error);
            }),
    )
  }
}
