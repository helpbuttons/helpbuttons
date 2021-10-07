import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { NetworkService } from 'services/Networks';
import INetwork from 'services/Networks/types';
import { alertService } from 'services/Alert';

//Called event for new user signup
export class CreateNetwork implements WatchEvent {
  public constructor(private network : INetwork, private token : string) {}
  public watch(state: GlobalState) {
    debugger
    return NetworkService.new(this.network, this.token).pipe(
          map((networkData) => new NetworkCreateEvent(networkData)),
          catchError((error) => {
            console.log("error: ", error);
            error = alertService.error;
            return of(error);
          })
    )
  }
}


//Called event for session update values
export class NetworkCreateEvent implements UpdateEvent {
  public constructor(private networkData: INetwork) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.network = this.networkData.id;
    });
  }
}
