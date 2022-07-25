import { Router } from 'next/router';
import { map, tap, catchError } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';
import { GlobalState } from 'store/Store';

import { alertService } from 'services/Alert';
import { errorService } from 'services/Error';
import { ButtonService } from 'services/Buttons';
import { IButton } from 'services/Buttons/button.type';
import { Bounds } from 'leaflet';

export interface ExploreState {
  visibleButtons: IButton[];
}

export const exploreInitial = {
  visibleButtons: [],
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
      newState.explore.visibleButtons = this.buttons;
    });
  }
}

export class CreateButton implements WatchEvent {
  public constructor(
    private button: IButton,
    private token: string,
    private networkId: string,
    private setValidationErrors
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.button, this.token, this.networkId).pipe(
      tap((buttonData) => {
        alertService.info(
          "Has creado un botón" + buttonData.response.id.toString()
        );
      }),
      catchError((error) => {
        if (error.response && error.response.validationErrors) {
          this.setValidationErrors(error.response.validationErrors);
        }
        return errorService.handle(error);
      })
    );
  }
}
