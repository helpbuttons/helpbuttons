import { catchError, tap, map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';


import { NetworkService } from 'services/Networks';
import { isHttpError } from 'services/HttpService';
import { of } from 'rxjs';
import { GlobalState, store } from 'state';
import { CreateNetworkDto } from 'shared/dtos/network.dto';
import { Network } from 'shared/entities/network.entity';
import { HttpStatus } from 'shared/types/http-status.enum';
import { UpdateExploreSettings } from './Explore';
import { useGlobalStore } from 'state';
import { useEffect, useRef } from 'react';
import { SetupSteps } from 'shared/setupSteps';
import { ConfigFound, GetConfig } from './Setup';
import { getLocale } from 'shared/sys.helper';
import { roundCoords } from 'shared/honeycomb.utils';
import dconsole from 'shared/debugger';
// import router from 'next/router';

export interface NetworksState {
  // networks: Network[];
  selectedNetwork: Network;
  selectedNetworkLoading: boolean;
  intialized: boolean;
} 

export const networksInitial = {
  selectedNetwork: {
    name: '...',
    description: '',
    buttonTemplates: [],
    topTags: [],
    backgroundColor: 'grey',
    textColor: 'pink',
  },
  selectedNetworkLoading: true,
  initialized: false,
};

export const useSelectedNetwork = (_selectedNetwork = null, onError = (error) => dconsole.error(error)) : Network => {
  const fetchingNetwork = useRef(false)
  const selectedNetwork = useGlobalStore((state: GlobalState) => state.networks.selectedNetwork);

  useEffect(() => {
    if(!selectedNetwork.initialized)
    {
      if(!_selectedNetwork && !fetchingNetwork.current )
        {
          fetchingNetwork.current = true
          store.emit(new FetchDefaultNetwork(() => dconsole.log('fetched network!!'), onError))
        }else if(_selectedNetwork){
          store.emit(new SelectedNetworkFetched(_selectedNetwork))
        }
    }
    
  }, [_selectedNetwork])

  return selectedNetwork;
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

export class FetchNetworkConfiguration implements WatchEvent {
  public constructor(private onSuccess, private onError) {}

  public watch(state: GlobalState) {
    return NetworkService.configuration().pipe(
      // With no Id, find the default network

      map((network) => {
        // store.emit(new SelectedNetworkFetched(network));
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
      newState.networks.intialized = true;
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
      return NetworkService.activity(getLocale()).pipe(
        map((activities) => {
          this.onSuccess(activities)
        }))
      }
    }
    
