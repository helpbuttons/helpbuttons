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
  networks: any;
  selectedNetwork: INetwork;
}


export const commonDataInitial = {
  heading: "(empty)",
  networks: null,
  selectedNetwork: null,
}

export class LoadCommonData implements UpdateEvent, WatchEvent {
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.commonData.heading = "Searching networks test";
    });
  }
  public watch(state: GlobalState) {
    return NetworkService.find().pipe(
      map((networks) => {
        new NetworksDataLoaded(networks);
      }),
      catchError((error) => {
        debugger
        console.log(error);
      }),

    )
  }
}


export class NetworksDataLoaded implements UpdateEvent {
  public constructor(private networks: any) {}
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.commonData.networks = this.networks.response;
    });
  }
  
}
