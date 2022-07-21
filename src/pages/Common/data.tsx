import { map } from 'rxjs/operators';
import { produce } from 'immer';
import Router from 'next/router';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';
import { GlobalState } from 'store/Store';

import { IUser } from 'services/Users/types';
import { INetwork } from 'services/Networks/network.type';
import { NetworkService } from 'services/Networks';

export interface CommonState {
  currentUser: IUser;
  // networks: INetwork[];
  selectedNetwork: INetwork;
}

export const commonInitial = {
  currentUser: undefined,
  // networks: [],
  selectedNetwork: undefined,
  selectedNetworkLoading: false,
}

export class FetchDefaultNetwork implements UpdateEvent, WatchEvent {
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.common.selectedNetworkLoading = true;
    });
  }

  public watch(state: GlobalState) {
    return NetworkService.findById().pipe(  // With no Id, find the default network
      map((network) => new SelectedNetworkFetched(network)),
    );
  }
}

export class SelectedNetworkFetched implements UpdateEvent {
  public constructor(private network: INetwork) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.common.selectedNetwork = this.network;
      newState.common.selectedNetworkLoading = false;
    });
  }
}

export class SetCurrentUser implements UpdateEvent {
  public constructor(private currentUser: IUser) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.common.currentUser = this.currentUser;
    });
  }
}

export class NavigateTo implements EffectEvent {
  public constructor(private path: string) {}

  public effect(state: GlobalState) {
    Router.push({ pathname: this.path, state: {} });
  }
}


// //NETWORK LIST
// export class LoadCommonNetworks implements UpdateEvent, WatchEvent {
//   public update(state: GlobalState) {
//     return produce(state, newState => {
//       //add here anything to be updated not as observable
//     });
//   }
//   public watch(state: GlobalState) {
//     return NetworkService.find().pipe(
//       map((networks) => {
//
//        new NetworksDataLoaded(networks);
//
//       }),
//       catchError((error) => {
//       }),
//
//     )
//   }
// }
//
// //SELECTED NETWORK
// export class LoadCommonSelectedNetwork implements UpdateEvent, WatchEvent {
//   public constructor(private networkId: string) {}
//   public update(state: GlobalState) {
//     return produce(state, newState => {
//       //add her anything to be updated not as observable
//     });
//   }
//   public watch(state: GlobalState) {
//
//     return NetworkService.findById(this.networkId).pipe(
//       map((selectedNetwork) => {
//        new SelectedNetworkDataLoaded(selectedNetwork);
//       }),
//       catchError((error) => {
//         console.error(error);
//       }),
//
//     )
//   }
// }
//
//
// export class NetworksDataLoaded implements UpdateEvent {
//   public constructor(private networks: any) {
//
//   }
//   public update(state: GlobalState) {
//
//     return produce(state, newState => {
//
//       newState.common.networks = this.networks.response[0];
//     });
//   }
//
// }
//
//
// export class SelectedNetworkDataLoaded implements UpdateEvent {
//   public constructor(private selectedNetwork: INetwork) {}
//   public update(state: GlobalState) {
//     return produce(state, newState => {
//       newState.common.selectedNetwork = this.selectedNetwork.response;
//     });
//   }
//
// }
