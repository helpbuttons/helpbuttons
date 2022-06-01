import { debounceTime } from "rxjs";
import { switchMap, filter } from "rxjs/operators";
import { NetworkService } from "services/Networks";
export function setValueAndDebounce(sub, ms) {
  return sub.asObservable().pipe(
    debounceTime(ms),
    switchMap((name) => NetworkService.find(name)) //n is id;
  );
}
