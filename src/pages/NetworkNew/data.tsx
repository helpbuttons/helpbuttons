import { map, tap, take, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { produce } from "immer";

import { WatchEvent } from "store/Event";
import { GlobalState } from "store/Store";

import { NetworkService } from "services/Networks";
import Router from "next/router";
import INetwork from "services/Networks/network.type.tsx";
import { alertService } from "services/Alert";
import { errorService } from "services/Error";
import { localStorageService } from "services/LocalStorage";

//Called event for new user signup
export class CreateNetworkEvent implements WatchEvent {
  public constructor(private network: INetwork, private token: string) {}
  public watch(state: GlobalState) {
    return NetworkService.new(this.network, this.token).pipe(
      map((networkData) => networkData),
      take(1),
      tap((networkData) => {
        alertService.info(
          "You have created a network" + networkData.response.id.toString()
        );

        //store net in Store
        new NetworkUpdateEvent(networkData);
        NetworkService.setSelectedNetwork(networkData.response.id);

        Router.push({ pathname: "/", state: state });
      }),
      catchError((error) => {
        return errorService.handle(error);
      })
    );
  }
}

//Called event for session update values
export class NetworkUpdateEvent implements UpdateEvent {
  public constructor(private network: any) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.selectedNetwork.id = this.network.response.id;
    });
  }
}
