import { map, catchError } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';

import { ButtonService } from 'services/Buttons';
import { GlobalState } from 'pages';
import { Button } from 'shared/entities/button.entity';
import { GeoService } from 'services/Geo';
import { UpdateButtonDto } from 'shared/dtos/feed-button.dto';
import { handleError } from './helper';

import { ButtonFilters, defaultFilters } from 'components/search/AdvancedFilters/filters.type';

export interface ExploreState {
  draftButton: any;
  mapCenter;
  mapZoom;
  currentButton: Button;
  map: ExploreMapState;
}

export interface ExploreMapState {
  filters: ButtonFilters;
  listButtons: Button[];  // if hexagon clicked, can be different from boundsButtons
  boundsFilteredButtons: Button[];
  loaded: boolean;
}

export const exploreInitial = {
  draftButton: null,
  mapCenter: null,
  mapZoom: -1,
  currentButton: null,
  map:
  {
    filters: defaultFilters,
    listButtons: [], // if hexagon clicked, can be different from boundsButtons
    boundsFilteredButtons: [],
    loaded: false,
  }
};

export class FindButtons implements WatchEvent {
  public constructor(
    private resolution: number,
    private hexagons: string[],
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return ButtonService.find(this.resolution, this.hexagons).pipe(
      map((buttons) => this.onSuccess(buttons)),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class FindAddress implements WatchEvent {
  public constructor(
    private q: string,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    const t = GeoService.findPromise(this.q)
      .then((place) => this.onSuccess(place))
      .catch((error) => {
        this.onError(error);
      });
  }
}

export class CreateButton implements WatchEvent {
  public constructor(
    private button: Button,
    private networkId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.new(this.button, this.networkId).pipe(
      map((buttonData) => {
        new ButtonFound(buttonData), this.onSuccess(buttonData);
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class SaveButtonDraft implements UpdateEvent {
  public constructor(private buttonDraft) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.draftButton = this.buttonDraft;
    });
  }
}

export class FindButton implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return ButtonService.findById(this.buttonId).pipe(
      map((button) => this.onSuccess(button)),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class ButtonFound implements UpdateEvent {
  public constructor(private button: Button) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton = this.button;
    });
  }
}

export class ClearCurrentButton implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton = null;
    });
  }
}
export class ButtonDelete implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return ButtonService.delete(this.buttonId).pipe(
      map((res) => {
        this.onSuccess();
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class UpdateButton implements WatchEvent {
  public constructor(
    private buttonId: string,
    private button: UpdateButtonDto,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.update(this.buttonId, this.button).pipe(
      map((data) => {
        this.onSuccess(data);
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}
export class updateCurrentButton implements UpdateEvent {
  public constructor(private button: Button) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton = this.button;
    });
  }
}

export class UpdateFilters implements UpdateEvent {
  public constructor(private filters: ButtonFilters) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.filters = this.filters;
      newState.explore.map.loaded = false;
    });
  }
}

export class UpdateBoundsFilteredButtons implements UpdateEvent {
  public constructor(private boundsFilteredButtons: Button[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.boundsFilteredButtons = this.boundsFilteredButtons;
      newState.explore.map.loaded = true
    });
  }
}

export class UpdateExploreUpdating implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.loaded = false
    });
  }
}
export class UpdateListButtons implements UpdateEvent {
  public constructor(private listButtons: Button[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.listButtons = this.listButtons;
      newState.explore.map.loaded = true
    });
  }
}