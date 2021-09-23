import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from '../store/Event';
import { GlobalState } from '../store/Store';

import { BackTestService } from '../../services/BackTest';
import { OpenApi } from '../../services/BackTest/types';


export interface BackTestState {
  heading: string;
  openApi: OpenApi;
}


export const backTestInitial = {
  heading: "(empty)",
  openApi: null,
}


export class LoadOpenApi implements UpdateEvent, WatchEvent {
  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.backTest.heading = "Prueba de comunicación con backend";
    });
  }

  public watch(state: GlobalState) {
    return BackTestService.getApi().pipe(
      map((openApi) => new OpenApiLoaded(openApi))
    )
  }
}


export class OpenApiLoaded implements UpdateEvent {
  public constructor(private openApi: OpenApi) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.backTest.openApi = this.openApi;
    });
  }
}
