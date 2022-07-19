import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';
import { GlobalState } from 'store/Store';

import { NetworkService } from 'services/Networks';
import { INetwork } from 'services/Networks/network.type';

export interface CommonState {
  // networks: INetwork[];
  selectedNetwork: INetwork;
}

export const commonInitial = {
  // networks: [],
  selectedNetwork: null,
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
