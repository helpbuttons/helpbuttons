import { NetworkService } from "services/Networks";

import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";
import { store } from "pages";
import { localStorageService } from "services/LocalStorage";
import { NetworkUpdateEvent } from "store/CommonData";
import { alertService } from "services/Alert";

export function setSelectedNetworkId(networkId: string) {
  localStorageService.save("network_id", networkId);
  
  return NetworkService.findById(networkId).subscribe(network => {
    if (network.response) {
      alertService.info("You have selected network '" + network.response.name.toString() + "'");
      store.emit(new NetworkUpdateEvent(network.response));
    }
  });
}

export function setValueAndDebounce(sub, ms) {
  return sub.asObservable().pipe(
    debounceTime(ms),
    switchMap((name) => NetworkService.find(name)) //n is id;
  );
}
