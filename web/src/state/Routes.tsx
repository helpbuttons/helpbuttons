import Router from 'next/router';

import { EffectEvent } from 'store/Event';
import { GlobalState } from 'state';

// TODO: not clear if this should be an event, a service
//       or directly call to Router in pages. Think about it.

export class NavigateTo implements EffectEvent {
  public constructor(private path: string) {}

  public effect(state: GlobalState) {
    Router.push({ pathname: this.path, state: {} });
  }
}

