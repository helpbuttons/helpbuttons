import { NetworkService } from "services/Networks";

import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";
import { localStorageService } from "services/LocalStorage";
import { selectedNetworkEvent } from "store/CommonData";
import { store } from "pages";

export function setSelectedNetworkId(networkId: string) {
  
  return NetworkService.findById(networkId).subscribe(network => {
    if (network.response) {
      alertService.info("You have selected network '" + network.response.name.toString() + "'");
      localStorageService.save("network_id", networkId);
      store.emit(new selectedNetworkEvent(network.response));
    }
  });
}

export function setValueAndDebounce(sub, ms) {
  return sub.asObservable().pipe(
    debounceTime(ms),
    switchMap((name) => NetworkService.find(name)) //n is id;
  );
}
