import { map, tap, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { NetworkService } from 'services/Networks';
import Router from 'next/router';
import INetwork from 'services/Networks/types';
import { alertService } from 'services/Alert';
import { errorService } from 'services/Error';

//Called event for new user signup
export class CreateNetworkEvent implements WatchEvent {
  public constructor(private network : INetwork, private token : string) {}
  public watch(state: GlobalState) {
    return NetworkService.new(this.network, this.token).pipe(
          map(networkData => networkData),
          take(1),
          tap(networkData => {
            new NetworkUpdateEvent(networkData)

            storeService.save('network_id',networkData.response.id);

            Router.push({ pathname: '/', state: {} });
          }),
          catchError((error) => {
            return errorService.handle(error);
          })
    )
  }
}


//Called event for session update values
export class NetworkUpdateEvent implements UpdateEvent {
  public constructor(private network: INetwork) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.network.id = this.network.response.id;
    });
  }
}
