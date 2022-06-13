import { NetworkService } from "services/Networks";

import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";

export function setSelectedNetworkId(networkId: string) {
  NetworkService.setSelectedNetworkId(networkId);
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
