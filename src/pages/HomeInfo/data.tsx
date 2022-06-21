import { NetworkService } from "services/Networks";

import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";

export function setSelectedNetworkId(networkId: string, setSelectedNetwork) {
  NetworkService.setSelectedNetworkId(networkId);
  return NetworkService.findById(networkId).subscribe(network => {
    if (network.response) {
      setSelectedNetwork(network.response);
    }
  });
}

export function getSelectedNetworkId() {
  return NetworkService.getSelectedNetworkId();
}

export function getSelectedNetwork(setSelectedNetwork) {
  const selectedNetworkId = getSelectedNetworkId();
  return NetworkService.findById(selectedNetworkId).subscribe(network => {
    if (network.response) {
      setSelectedNetwork(network.response);
    }
  });
}

export function setValueAndDebounce(sub, ms) {
  return sub.asObservable().pipe(
    debounceTime(ms),
    switchMap((name) => NetworkService.find(name)) //n is id;
  );
}
