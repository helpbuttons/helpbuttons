import { GlobalState, store } from "state";
import { catchError, map, of } from "rxjs";
import { GeoService } from "services/Geo";
import { WatchEvent } from "store/Event";
import { CacheMatch, CachePut } from "./Cache";

export class GeoFindAddress implements WatchEvent {
    uid = '';
    public constructor(private query: string, private onReady) {
      this.uid = `places_${query}`
    }
    
    public watch(state: GlobalState) {
      const found = CacheMatch(state, this.uid)
      if(found)
      {
        this.onReady(found.response)
        return of(undefined);
      }
      return GeoService.find(this.query).pipe(
        map((places) => {
            store.emit(new CachePut(this.uid, places))
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
    uid = '';
    public constructor(private lat: number, private lng: number, private onReady, private onError) {  
      this.uid = `place_${lat}${lng}`
    }
  
    public watch(state: GlobalState) {
      const found = CacheMatch(state, this.uid)
      if(found)
      {
        console.log('hit')
        console.log(found)
        this.onReady(found.response)
        return of(undefined);
      }
      return GeoService.reverse(this.lat, this.lng).pipe(
        map((place) => {
            store.emit(new CachePut(this.uid, place))
            this.onReady(place)
        }),
        catchError((error) => {
          console.error(error)
          this.onError(error)
          return of(undefined)
        }),
      );
    }
  }
  export function emptyPlace(position = {lat:'0' ,lng: '0'}) {
    return {
      formatted: 'Unknown place',
      formatted_city: 'Unknown place',
      geometry: position,
      id: '',
    }
  }