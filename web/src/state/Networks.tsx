import { catchError, tap, map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';


import { NetworkService } from 'services/Networks';
import { isHttpError } from 'services/HttpService';
import { of } from 'rxjs';
import { GlobalState, store } from 'pages';
import { CreateNetworkDto } from 'shared/dtos/network.dto';
import { Network } from 'shared/entities/network.entity';
import { HttpStatus } from 'shared/types/http-status.enum';
import { UpdateExploreSettings } from './Explore';
import { useStore } from 'store/Store';
import { useEffect, useRef } from 'react';

export interface NetworksState {
  // networks: Network[];
  selectedNetwork: Network;
  selectedNetworkLoading: boolean;
} 

export const networksInitial = {
  // selectedNetwork: {
  //   name: '...',
  //   description: '',
  //   buttonTemplates: [],
  //   topTags: [],
  //   backgroundColor: 'grey',
  //   textColor: 'pink'
  // },
  selectedNetworkLoading: false,
};

export const useSelectedNetwork = (_selectedNetwork = null) : Network => {
  useEffect(() => {
    if(!_selectedNetwork )
    {
      store.emit(new FetchDefaultNetwork(() => console.log('fetched network!!'), () => console.log('failed!')))
    }else{
      store.emit(new SelectedNetworkFetched(_selectedNetwork))
    }
  }, [_selectedNetwork])
  
  return useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
}

export class setNetwork implements UpdateEvent {
  public constructor(private network) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.networks.selectedNetwork = this.network
    });
  }
}
export class UpdateNetworkBackgroundColor implements UpdateEvent {
  public constructor(public color: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.networks.selectedNetwork.backgroundColor = this.color;
    });
  }
}
export class UpdateNetworkTextColor implements UpdateEvent {
  public constructor(public color: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.networks.selectedNetwork.textColor = this.color;
    });
  }
}


export class FetchDefaultNetwork implements UpdateEvent, WatchEvent {
  public constructor(private onSuccess, private onError) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.networks.selectedNetworkLoading = true;
    });
  }

  public watch(state: GlobalState) {
    if(state.networks.selectedNetwork)
    {
      console.log('already loadingd')
      return of(state.networks.selectedNetwork)
    }
    console.log('fetching..... ')

    return NetworkService.findById().pipe(
      // With no Id, find the default network

      map((network) => {
        store.emit(new SelectedNetworkFetched(network));
        if (network && this.onSuccess) {
          this.onSuccess(network);
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
      newState.networks.selectedNetwork = this.network
      newState.networks.selectedNetworkLoading = false;
      // newState.explore.settings = this.network.exploreSettings
    });
  }
}

export class CreateNetwork implements WatchEvent {
    public constructor(
      private network,
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

  export class UpdateNetwork implements WatchEvent {
    public constructor(
      private network,
      private onSuccess,
      private onError
    ) {}
    public watch(state: GlobalState) {
      return NetworkService.update(this.network).pipe(
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


  export class FindLatestNetworkActivity implements WatchEvent {
    public constructor( private onSuccess
    ) {}
    public watch(state: GlobalState) {
      return NetworkService.activity().pipe(
        map((activities) => {
          this.onSuccess(activities)
        }))
      }
    }
    
