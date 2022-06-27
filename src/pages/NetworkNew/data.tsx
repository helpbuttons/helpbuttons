
import { NetworkService } from "services/Networks";
import Router from "next/router";
import { alertService } from "services/Alert";
import { errorService } from "services/Error";
import { store } from "pages";
import { selectedNetworkEvent } from "store/CommonData"
import { localStorageService } from "services/LocalStorage";
import { INetwork } from "services/Networks/network.type";
import { GlobalState } from "pages";
import { catchError, tap } from "rxjs/operators";
import { WatchEvent } from "store/Event";

export function createNewNetwork(network, token: string, setValidationErrors) {
  store.emit(new CreateNetworkEvent(network, token,
    (networkData :INetwork) => {
      localStorageService.save("network_id", networkData.id);
      store.emit(new selectedNetworkEvent(networkData));
            
      alertService.info(
        "You have created a network" + networkData.id.toString()
      );
      
      Router.push("/");
    },
    (error) => {
    if (error.response && error.response.validationErrors) {
      setValidationErrors(error.response.validationErrors);
    }
    return errorService.handle(error);
    }
  ));
}

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
  