import { NetworkService } from "services/Networks";

import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";

export function setSelectedNetwork(networkId: string) {
  NetworkService.setSelectedNetwork(networkId);
}

export function setValueAndDebounce(sub, ms) {
  return sub.asObservable().pipe(
    debounceTime(ms),
    switchMap((name) => NetworkService.find(name)) //n is id;
  );
}
