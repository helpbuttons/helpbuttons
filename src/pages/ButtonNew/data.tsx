import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { UserService } from 'services/Users';
import { IUser } from 'services/Users/types';
import { alertService } from 'services/Alert';

//Called event for new user signup
export class CreateEvent implements WatchEvent {
  public constructor(private name: string, private type: string, private type: string, private description: string, private geoPlace: {}, private created: string, private modified: string, private owner: string, private templateButtonId: int) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.name, this.type, this.description, this.geoPlace, this.created, this.modified, this.owner, this.templateButtonId ).pipe(
      map((buttonData) => new ButtonCreateEvent(buttonData)),
      catchError((error) => {
        console.log("error: ", error);
        error = alertService.error;
        return of(error);
      })
    )
    .subscribe(output2 => alert(output2));
  }
}

//Called event for session update values
export class ButtonCreateEvent implements UpdateEvent {
  public constructor(private buttonData: IButton) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.user = this.userData;
    });
  }
}
