import produce from 'immer';
import { GlobalState } from 'state';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { useGlobalStore } from 'state';

export interface CacheValue {
  key: string;
  response: any;
}

export class CachePut implements UpdateEvent {
  public constructor(private uid: string, private response: any) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.cacheValues.push({
        key: this.uid,
        response: this.response,
      });
    });
  }
}

export class CacheFind implements WatchEvent {
    public constructor(private key: string) {}
    public watch(state: GlobalState) {
      return state.cacheValues.find(
        (cacheVal) => cacheVal.key == this.key,
      );
    }
  }
  

export const CacheMatch = (state : GlobalState, key :string) : CacheValue => {
  return state.cacheValues.find((cacheVal) => cacheVal.key == key);
};
