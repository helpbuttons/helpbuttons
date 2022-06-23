import produce from "immer";
import { GlobalState } from "pages";
import { catchError, tap } from "rxjs/operators";
import { NetworkService } from "services/Networks";
import { INetwork } from "services/Networks/network.type";
import { UpdateEvent, WatchEvent } from "./Event";

export class CreateNetworkEvent implements WatchEvent {
    public constructor(
      private network: INetwork,
      private token: string,
      private successFunction,
      private failFunction
    ) {}
    public watch(state: GlobalState) {
      return NetworkService.new(this.network, this.token).pipe(
        tap((networkData) => {
          this.successFunction(networkData.response);
        }),
        catchError((error) => {
          return this.failFunction(error);
        })
      );
    }
  }
  
  export class NetworkUpdateEvent implements UpdateEvent {
    public constructor(private network: any) {}
    public update(state: GlobalState) {
      return produce(state, (newState: GlobalState) => {
        newState.commonData.selectedNetwork = this.network;
      });
    }
  }