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
  currentButton: Button;
  map: ExploreMapState;
}

export interface ExploreMapState {
  filters: ButtonFilters;
  listButtons: Button[];  // if hexagon clicked, can be different from boundsButtons
  boundsFilteredButtons: Button[];
  densityMap: any[];
  loading: boolean;
  initialized: boolean;
}
export const exploreInitial = {
  draftButton: null,
  currentButton: null,
  map:
  {
    filters: defaultFilters,
    listButtons: [], // if hexagon clicked, can be different from boundsButtons
    boundsFilteredButtons: [],
    densityMap: [],
    loading: true,
    initialized: false,
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
      console.log('updating buttons... filters changed')
      newState.explore.map.loading = true;
    });
  }
}

export class UpdateFiltersToFilterTag implements UpdateEvent {
  public constructor(private tag: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.filters = {...defaultFilters, tags: [this.tag]};
      newState.explore.map.loading = true;
    });
  }
}
export class UpdateFiltersToFilterButtonType implements UpdateEvent {
  public constructor(private buttonType: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.filters = {...defaultFilters, helpButtonTypes: [this.buttonType]};
      newState.explore.map.loading = true;
    });
  }
}


export class UpdateBoundsFilteredButtons implements UpdateEvent {
  public constructor(private boundsFilteredButtons: Button[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.boundsFilteredButtons = this.boundsFilteredButtons;
      console.log('loaded filtered buttons')
      newState.explore.map.loading = false
      newState.explore.map.initialized = true
    });
  }
}

export class UpdateExploreUpdating implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      console.log('updating explore ?')
      newState.explore.map.loading = true
    });
  }
}
export class UpdateListButtons implements UpdateEvent {
  public constructor(private listButtons: Button[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      console.log('loaded list of buttons')
      newState.explore.map.listButtons = this.listButtons;
      newState.explore.map.loading = false
      newState.explore.map.initialized = true
    });
  }
}

export class UpdateDensityMap implements UpdateEvent {
  public constructor(private densityMap: any[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.densityMap = this.densityMap;
    });
  }
}