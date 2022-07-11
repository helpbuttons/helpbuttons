
import { store } from "pages";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import { NetworkService } from "services/Networks";
import { NetworkUpdateEvent } from "store/CommonData";

export function loadSelectedNetworkId() {
    const networkId = localStorageService.read(LocalStorageVars.NETWORK_SELECTED);
    return NetworkService.findById(networkId).subscribe(network => {
      if (network.response) {
        store.emit(new NetworkUpdateEvent(network.response));
      }
    });
  }