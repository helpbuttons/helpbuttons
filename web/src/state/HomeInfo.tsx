import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";
import { GeoService } from "services/Geo";

export function setValueAndDebounce(sub, ms) {
    return sub.asObservable().pipe(
      debounceTime(ms),
      switchMap((address: string) => GeoService.find(address)) //n is id;
    );
}