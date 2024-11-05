import { GlobalState } from "pages";
import { catchError, map, of } from "rxjs";
import { GeoService } from "services/Geo";
import { WatchEvent } from "store/Event";

export class GeoFindAddress implements WatchEvent {
    public constructor(private query: string, private onReady) {}
  
    public watch(state: GlobalState) {
      return GeoService.find(this.query).pipe(
        map((places) => {
            this.onReady(places)
        }),
        catchError((error) => {
          console.error(error)
          return of(undefined)
        }),
      );
    }
  }

  export class GeoReverseFindAddress implements WatchEvent {
    public constructor(private lat: number, private lng: number, private onReady) {}
  
    public watch(state: GlobalState) {
      return GeoService.reverse(this.lat, this.lng).pipe(
        map((places) => {
            this.onReady(places)
        }),
        catchError((error) => {
          console.error(error)
          return of(undefined)
        }),
      );
    }
  }