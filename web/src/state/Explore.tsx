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

import {
  ButtonFilters,
  defaultFilters,
} from 'components/search/AdvancedFilters/filters.type';
import {
  BrowseType,
  HbMapTiles,
} from 'components/map/Map/Map.consts';
import { Bounds } from 'pigeon-maps';
import {
  LocalStorageVars,
  localStorageService,
} from 'services/LocalStorage';

export interface ExploreState {
  draftButton: any;
  currentButton: Button;
  map: ExploreMapState;
  settings: ExploreSettings;
}

export interface ExploreSettings {
  center: number[];
  zoom: number;
  bounds: Bounds;
  honeyCombFeatures: any;
  prevZoom: number;
  loading: boolean;
}

export const exploreSettingsDefault: ExploreSettings = {
  center: [0, 0],
  zoom: 4,
  bounds: null,
  honeyCombFeatures: null,
  prevZoom: 0,
  loading: true,
};
export interface ExploreMapState {
  filters: ButtonFilters;
  queryFoundTags: string[];
  listButtons: Button[]; // if hexagon clicked, can be different from boundsButtons
  boundsFilteredButtons: Button[];
  cachedHexagons: any[];
  loading: boolean;
  initialized: boolean;
}
export const exploreInitial = {
  draftButton: null,
  currentButton: null,
  map: {
    filters: defaultFilters,
    queryFoundTags: [],
    listButtons: [], // if hexagon clicked, can be different from boundsButtons
    boundsFilteredButtons: [],
    cachedHexagons: [],
    loading: true,
    initialized: false,
  },
  settings: exploreSettingsDefault,
};

export class FindButtons implements WatchEvent, UpdateEvent {
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
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.loading = true;
    });
  }
}

export class ReverseGeo implements WatchEvent {
  public constructor(
    private lat: number,
    private lng: number,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return GeoService.reverse(this.lat, this.lng).pipe(
      map((place) => this.onSuccess(place)),
      catchError((error) => handleError(this.onError, error))
    );
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
export class ButtonDelete implements WatchEvent, UpdateEvent {
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

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.boundsFilteredButtons = []
      newState.explore.map.cachedHexagons = []
      newState.explore.map.listButtons = []
    });
  }
}

export class UpdateButton implements WatchEvent, UpdateEvent {
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

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.boundsFilteredButtons = []
      newState.explore.map.cachedHexagons = []
      newState.explore.map.listButtons = []
    });
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
    });
  }
}

export class UpdateFiltersToFilterTag implements UpdateEvent {
  public constructor(private tag: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      // use query to filter tag...
      newState.explore.map.filters = {
        ...defaultFilters,
        query: this.tag,
      };
    });
  }
}

export class UpdateQueryFoundTags implements UpdateEvent {
  public constructor(private tags: string[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.queryFoundTags = this.tags;
    });
  }
}
export class UpdateFiltersToFilterButtonType implements UpdateEvent {
  public constructor(private buttonType: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.filters = {
        ...defaultFilters,
        helpButtonTypes: [this.buttonType],
      };
    });
  }
}

export class UpdateBoundsFilteredButtons implements UpdateEvent {
  public constructor(private boundsFilteredButtons: Button[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.boundsFilteredButtons =
        this.boundsFilteredButtons;
      newState.explore.map.loading = false;
      newState.explore.map.initialized = true;
    });
  }
}

export class UpdateExploreUpdating implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.loading = true;
    });
  }
}
export class UpdateListButtons implements UpdateEvent {
  public constructor(private listButtons: Button[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.listButtons = this.listButtons;
      newState.explore.map.loading = false;
      newState.explore.map.initialized = true;
    });
  }
}

export class UpdateCachedHexagons implements UpdateEvent {
  public constructor(private cachedHexagons: any[]) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.cachedHexagons = this.cachedHexagons;
    });
  }
}
export class ClearCachedHexagons implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.cachedHexagons = [];
    });
  }
}
export class UpdateExploreSettings implements UpdateEvent {
  public constructor(
    private newExploreSettings: Partial<ExploreSettings>,
  ) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      const prevSettings = state.explore.settings;

      const localStorageExploreSettings = localStorageService.read(
        LocalStorageVars.EXPLORE_SETTINGS,
      );
      let locaStorageVars = {};
      if (localStorageExploreSettings) {
        locaStorageVars = JSON.parse(localStorageExploreSettings);
      }
      const newExploreSettings = {
        ...prevSettings,
        prevZoom: prevSettings.zoom,
        ...this.newExploreSettings,
        loading: false,
      };
      newState.explore.settings = newExploreSettings;
      localStorageService.save(
        LocalStorageVars.EXPLORE_SETTINGS,
        JSON.stringify(newExploreSettings),
      );
    });
  }
}

export class SetExploreSettingsBoundsLoaded implements UpdateEvent{
  public constructor(
  ) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.settings.bounds = null;
    });
  }
}