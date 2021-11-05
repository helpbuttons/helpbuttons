import { map, tap, take, catchError } from 'rxjs/operators';
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
          map(networkData => networkData),
          take(1),
          tap(networkData => {
            new NetworkUpdateEvent(networkData)
            debugger
            if(networkData.response.id)
            window.localStorage.setItem('network_id', networkData.response.id);
          }),
          catchError((error) => {
            console.log("error: ", error.message);
            if(error.response.error.details) {
              alertService.error(error.response.error.details[0].message);
            } else {
              alertService.error(error.response.error.message);
            }
            return of(error);
          })
    )
  }
}


//Called event for session update values
export class NetworkUpdateEvent implements UpdateEvent {
  public constructor(private network: INetwork) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      debugger
      newState.network.id = this.network.response.id;
    });
  }
}
