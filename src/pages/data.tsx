import { store } from "pages";
import { localStorageService } from "services/LocalStorage";
import { selectedNetworkEvent } from "../store/CommonData";
import { NetworkService } from "services/Networks";

export function loadStoreValues() {
    loadSelectedNetworkId();
}
function loadSelectedNetworkId() {
    const networkId = localStorageService.read("network_id");
    if (!networkId) {
      return null;
    }
    return NetworkService.findById(networkId).subscribe(network => {
      if (network.response) {
        store.emit(new selectedNetworkEvent(network.response));
      }
    });
}