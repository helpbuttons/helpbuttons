import { Router } from 'next/router';
import { map, tap, catchError } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';

import { alertService } from 'services/Alert';
import { ButtonService } from 'services/Buttons';
import { Bounds, Point } from 'pigeon-maps';
import { of } from 'rxjs';
import { isHttpError } from 'services/HttpService';
import { GlobalState, store } from 'pages';
import { Button } from 'shared/entities/button.entity';
import { GeoService } from 'services/Geo';
import { HttpStatus } from 'shared/types/http-status.enum';
import { UpdateButtonDto } from 'shared/dtos/feed-button.dto';
import { handleError } from './helper';

import { debounceTime } from "rxjs";
import { switchMap } from "rxjs/operators";
interface ExploreMapProps {
  defaultCenter: Point;
  defaultZoom: number;
  markers: Button[];
  handleBoundsChange: Function;
}
export interface ExploreState {
  draftButton: Button
  showLeftColumn: boolean
  mapCenter
  mapZoom
  currentButton: Button
  mapBondsButtons: Button[]
}

export const exploreInitial = {
  draftButton: null,
  showLeftColumn: true,
  mapCenter: null,
  mapZoom: -1,
  currentButton: null,
  mapBondsButtons: [],
}

export function setButtonsAndDebounce(sub, ms) {
    return sub.asObservable().pipe(
      debounceTime(ms),
      switchMap((options : string, id) => ButtonService.findJson(options)
      )
    );
}

export class FindButtons implements WatchEvent {
  public constructor( private bounds: Bounds) {}

  public watch(state: GlobalState) {
    return ButtonService.find(this.bounds).pipe(
      map((buttons) => new ButtonsFound(buttons)),
    );
  }
}

export class ButtonsFound implements UpdateEvent {
  public constructor(private buttons: Button[]) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.mapBondsButtons = this.buttons;
    });
  }
}

export class FindAddress implements WatchEvent {
  public constructor(private q: string, private onSuccess, private onError) {}

  public watch(state: GlobalState) {
    const t =  GeoService.findPromise(this.q)
    .then((place) =>
      this.onSuccess(place)  
    )
    .catch((error) => {
      this.onError(error)
    })
  }
}

export class CreateButton implements WatchEvent {
  public constructor(
    private button: Button,
    private networkId: string,
    private onSuccess,
    private onError
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.button, this.networkId).pipe(
      map((buttonData) => {
        new ButtonFound(buttonData),
        this.onSuccess();
      }),
      catchError((error) => handleError(this.onError, error))
    );
  }
}

export class SaveButtonDraft implements UpdateEvent {
  public constructor(private button: Button) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.draftButton = this.button;
    });
  }
}

export class FindButton implements WatchEvent {
  public constructor(private buttonId: string, private onSuccess,private onError) {}

  public watch(state: GlobalState) {
    return ButtonService.findById(this.buttonId).pipe(
      map((button) => this.onSuccess(button)),
      catchError((error) => handleError(this.onError,error))
    );
  }
}

export class ButtonFound implements UpdateEvent {
  public constructor(private button: Button) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.currentButton = this.button;
    });
  }
}

export class ClearCurrentButton implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.currentButton = null;
    });
  }
}
export class SetAsCurrentButton implements WatchEvent {
  public constructor(private buttonId: string) {}

  public watch(state: GlobalState) {
    if (this.buttonId == state.explore.currentButton?.id) {
      return of(undefined);
    }
    state.explore.mapBondsButtons.filter((button) => {
      if(button.id == this.buttonId)
      {
        return new ButtonFound(button)
      }
    })
    return ButtonService.findById(this.buttonId).pipe(
      map((button) => new ButtonFound(button)),
    );
  }
}


export class ButtonDelete implements WatchEvent {
  public constructor(private buttonId: string, private onSuccess, private onError) {}

  public watch(state: GlobalState) {
    return ButtonService.delete(this.buttonId).pipe(
      map((rowsAffected) => {
        console.log(rowsAffected)
        if (rowsAffected > 0){
          this.onSuccess()
        }else {
          this.onError('error-deleting')
        }
      }),
      catchError((error) => handleError(this.onError, error))
    );
  }
}


export class UpdateButton implements WatchEvent {
  public constructor(
    private buttonId: string,
    private button: UpdateButtonDto,
    private onSuccess,
    private onError
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.update(this.buttonId, this.button).pipe(
      map((data) => {
        this.onSuccess(data);
      }),
      catchError((error) => handleError(this.onError, error))
    );
  }
}
export class updateCurrentButton implements UpdateEvent {
  public constructor(private button: Button) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.currentButton = this.button;
    });
  }
}

export class updateShowLeftColumn implements UpdateEvent {
  public constructor(private toggle: boolean) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.showLeftColumn = this.toggle;
    });
  }
}
