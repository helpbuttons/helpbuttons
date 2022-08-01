import { Router } from 'next/router';
import { map, tap, catchError } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';

import { alertService } from 'services/Alert';
import { errorService } from 'services/Error';
import { ButtonService } from 'services/Buttons';
import { IButton } from 'services/Buttons/button.type';
import { Bounds } from 'leaflet';
import { of } from 'rxjs';
import { isHttpError } from 'services/HttpService';
import { GlobalState } from 'pages';

export interface ExploreState {
  mapBondsButtons: IButton[];
}

export const exploreInitial = {
  mapBondsButtons: [],
}

export class FindButtons implements WatchEvent {
  public constructor(private networkId: string, private bounds: Bounds) {}

  public watch(state: GlobalState) {
    return ButtonService.find(this.networkId, this.bounds).pipe(
      map((buttons) => new ButtonsFound(buttons)),
    );
  }
}

export class ButtonsFound implements UpdateEvent {
  public constructor(private buttons: IButton[]) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.mapBondsButtons = this.buttons;
    });
  }
}

export class CreateButton implements WatchEvent {
  public constructor(
    private button: IButton,
    private networkId: string,
    private onSuccess,
    private onError
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.button, this.networkId).pipe(
      map((buttonData) => {
        this.onSuccess();
      }),
      catchError((error) => {
        let err = error.response;
        
        if (isHttpError(err) && err.statusCode === 401) { // Unauthorized
          this.onError("unauthorized");
        } else if (err.statusCode === 400 && err.message === "validation-error") {
          this.onError(" validations error")
        } else {
          throw error;
        }
        return of(undefined);
      })
    );
  }
}
