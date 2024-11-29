import { GlobalState, store } from "pages";
import { catchError, map, of } from "rxjs";
import { GeoService } from "services/Geo";
import { UpdateEvent, WatchEvent } from "store/Event";
import { CacheMatch, CachePut } from "./Cache";
import produce from "immer";

export interface GeoMapState {
  latCenterSearch: string,
  lngCenterSearch: string
} 

export const geoMapInitial:GeoMapState = {
  latCenterSearch: '0',
  lngCenterSearch: '0'
};

export class SetGeoSearchCenter implements UpdateEvent{
  public constructor(private latCenter: string, private lngCenter: string) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.geo.latCenterSearch = this.latCenter
      newState.geo.lngCenterSearch = this.lngCenter
    });
  }
}
export class GeoFindAddress implements WatchEvent {
    uid = '';
    public constructor(private latCenter: string, private lngCenter: string, private query: string, private onReady) {
      this.uid = `places_${query}`
    }
    
    public watch(state: GlobalState) {
      const found = CacheMatch(state, this.uid)
      if(found)
      {
        this.onReady(found.response)
        return of(undefined);
      }
      return GeoService.find(this.latCenter, this.lngCenter, this.query).pipe(
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