import produce from "immer";
import { GlobalState } from "pages";
import { catchError, tap } from "rxjs/operators";
import { NetworkService } from "services/Networks";
import { INetwork } from "services/Networks/network.type";
import { UpdateEvent, WatchEvent } from "./Event";

 
export class selectedNetworkEvent implements UpdateEvent {
  public constructor(private network: any) { }
  
  public update(state: GlobalState) {
    return produce(state, (newState: GlobalState) => {
      newState.common.selectedNetwork = this.network;
    });
  }
}
