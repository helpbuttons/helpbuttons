
import { NetworkService } from "services/Networks";
import Router from "next/router";
import { alertService } from "services/Alert";
import { errorService } from "services/Error";
import { store } from "pages";
import { CreateNetworkEvent, NetworkUpdateEvent } from "store/CommonData"
import { localStorageService } from "services/LocalStorage";
import { INetwork } from "services/Networks/network.type";
  
export function createNewNetwork(network, token: string, setValidationErrors) {
  store.emit(new CreateNetworkEvent(network, token,
    (networkData :INetwork) => {
      localStorageService.save("network_id", networkData.id);
      store.emit(new NetworkUpdateEvent(networkData));
            
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
