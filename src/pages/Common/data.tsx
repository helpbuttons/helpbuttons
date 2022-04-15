import { map, catchError } from 'rxjs/operators';
import React, { useState } from 'react';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';
import { GlobalState } from 'store/Store';

import { NetworkService } from 'services/Networks';
import { INetwork } from 'services/Networks/types';


export interface CommonDataState {
  heading: string;
  networks: INetwork[];
  selectedNetwork: INetwork;
}


export const commonDataInitial = {
  heading: "(empty)",
  networks: [],
  selectedNetwork: null,
}

//NETWORK LIST
export class LoadCommonNetworks implements UpdateEvent, WatchEvent {
  public update(state: GlobalState) {
    return produce(state, newState => {
      //add here anything to be updated not as observable
    });
  }
  public watch(state: GlobalState) {
    return NetworkService.find().pipe(
      map((networks) => {
       new NetworksDataLoaded(networks);
      }),
      catchError((error) => {
        console.log(error);
      }),

    )
  }
}

//SELECTED NETWORK
export class LoadCommonSelectedNetwork implements UpdateEvent, WatchEvent {
  public constructor(private networkId: string) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      //add her anything to be updated not as observable
    });
  }
  public watch(state: GlobalState) {
    //debugger
    return NetworkService.findById(this.networkId).pipe(
      map((selectedNetwork) => {
       new SelectedNetworkDataLoaded(selectedNetwork);
      }),
      catchError((error) => {
        console.log(error);
      }),

    )
  }
}


export class NetworksDataLoaded implements UpdateEvent {
  public constructor(private networks: any) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      debugger
      newState.commonData.networks = this.networks.response;
    });
  }

}


export class SelectedNetworkDataLoaded implements UpdateEvent {
  public constructor(private selectedNetwork: INetwork) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.commonData.selectedNetwork = this.selectedNetwork.response;
    });
  }

}
