import produce from 'immer';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { UpdateEvent } from 'store/Event';

export class UpdateMetadata implements UpdateEvent {
  public constructor(private metadata) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.metadata = this.metadata;
    });
  }
}

export class UpdateMetadataTitle implements UpdateEvent {
  public constructor(private title) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.metadata.title = state.networks.selectedNetwork.name + ' - ' + this.title;
    });
  }
}

export function useMetadataTitle(title) {
  useEffect(() => {
    store.emit(new UpdateMetadataTitle(title));
  }, []);
}