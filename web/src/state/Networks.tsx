import { catchError, tap, map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';
import { GlobalState } from 'store/Store';


import { NetworkService } from 'services/Networks';
import { isHttpError } from 'services/HttpService';
import { of } from 'rxjs';
import { HttpStatus } from 'services/HttpService/http-status.enum';
import { store } from 'pages';
import { CreateNetworkDto } from 'shared/dtos/network.dto';
import { Network } from 'shared/entities/network.entity';

export interface NetworksState {
  // networks: Network[];
  selectedNetwork: Network;
  selectedNetworkLoading: boolean;
}

export const networksInitial = {
  // networks: [],
  selectedNetwork: undefined,
  selectedNetworkLoading: false,
};

export class FetchDefaultNetwork implements UpdateEvent, WatchEvent {
  public constructor(private onSuccess, private onError) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.networks.selectedNetworkLoading = true;
    });
  }

  public watch(state: GlobalState) {
    return NetworkService.findById().pipe(
      // With no Id, find the default network

      map((network) => {
        store.emit(new SelectedNetworkFetched(network));
        if (network && this.onSuccess) {
          this.onSuccess();
        }
      }),
      catchError((error) => {
        if (!error.response) {
          this.onError('backend is not running')
          return of(undefined)
        }

        const err = error.response;
        if (
          isHttpError(err) &&
          err.statusCode === HttpStatus.NOT_FOUND
        ) {
          // do nothing, its ok! it will jump to the setup!
          this.onError('network-not-found');
        }
        return of(undefined);
      }),
    );
  }
}

export class SelectedNetworkFetched implements UpdateEvent {
  public constructor(private network: Network) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.networks.selectedNetwork = this.network;
      newState.networks.selectedNetworkLoading = false;
    });
  }
}

export class CreateNetwork implements WatchEvent {
    public constructor(
      private network : CreateNetworkDto,
      private onSuccess,
      private onError
    ) {}
    public watch(state: GlobalState) {
      return NetworkService.new(this.network).pipe(
        map((networkData) => {
          this.onSuccess(networkData.response);
        }),
        catchError((error) => {
          if(!error.response){
            this.onError(error, this.network);
            throw error
          }
          let err = error.response;
          
          if (isHttpError(err) && err.statusCode === 401) { // Unauthorized
            this.onError("unauthorized", this.network);
          } else if (err.statusCode === HttpStatus.BAD_REQUEST && err.message === "validation-error" && err.validationErrors) {
            this.onError(err)
          } else{
            this.onError(err)
            throw error;
          }
          return of(undefined);
        })
      );
    }
  }

