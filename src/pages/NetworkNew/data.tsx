import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { NetworkService } from 'services/Networks';
import INetwork from 'services/Networks/types';
import { alertService } from 'services/Alert';

//Called event for new user signup
export class CreateNetworkEvent implements WatchEvent {
  public constructor(private network : INetwork, private token : string) {}
  public watch(state: GlobalState) {
    return NetworkService.new(this.network, this.token).pipe(
          map((networkData) => new NetworkUpdateEvent(networkData)),
          catchError((error) => {
            console.log("error: ", error);
            error = alertService.error;
            return of(error);
          })
    )
  }
}


//Called event for session update values
export class NetworkUpdateEvent implements UpdateEvent {
  public constructor(private network: INetwork) {}
  public update(state: GlobalState) {
    console.log(this.network.response);
    return produce(state, newState => {
      newState.network.id = this.network.response.id;
    });
  }
}
