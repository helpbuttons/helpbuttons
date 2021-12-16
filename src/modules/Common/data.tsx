import { map } from 'rxjs/operators';
import React, { useState } from 'react';
import { produce } from 'immer';

import { WatchEvent } from '../store/Event';
import { GlobalState } from '../store/Store';

import { NetworkService } from '../../services/Networks';
import { INetwork } from '../../services/Networks/types';


export interface CommonDataState {
  heading: string;
  networks: any;
  selectedNetwork: INetwork;
}


export const commonInitial = {
  heading: "(empty)",
  networks: null,
  selectedNetwork: null,
}

export class LoadCommonData implements UpdateEvent, WatchEvent {
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.commonData.heading = "Seraching networks test";
    });
  }

  public watch(state: GlobalState) {
    return NetworkService.find().pipe(
      map((networks) => new NetworksDataLoaded(networks))
    )
  }
}


export class NetworksDataLoaded implements UpdateEvent {
  public constructor(private networks: any) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.commonData.networks = this.networks;
    });
  }
}

export class SelectedNetworkDataLoaded implements UpdateEvent {
  public constructor(private selectedNetwork: INetwork) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.commonData.selectedNetwork = this.selectedNetwork;
    });
  }
}
