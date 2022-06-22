import { NetworkService } from "services/Networks";

import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";
import { store } from "pages";

export function setSelectedNetworkId(networkId: string) {
  return NetworkService.setSelectedNetworkId(networkId);
  
}

export function getSelectedNetworkId() {
  return NetworkService.getSelectedNetworkId();
}

export function setValueAndDebounce(sub, ms) {
  return sub.asObservable().pipe(
    debounceTime(ms),
    switchMap((name) => NetworkService.find(name)) //n is id;
  );
}
