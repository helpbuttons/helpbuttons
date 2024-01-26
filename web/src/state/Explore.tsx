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
import { Bounds } from 'pigeon-maps';

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
  hexagonClicked: string;
}

export const exploreSettingsDefault: ExploreSettings = {
  center: null,
  zoom: 4,
  bounds: null,
  honeyCombFeatures: null,
  prevZoom: 0,
  loading: true,
  hexagonClicked: null
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

export class CreateButton implements WatchEvent, UpdateEvent {
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

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.boundsFilteredButtons = []
      newState.explore.map.cachedHexagons = []
      newState.explore.map.listButtons = []
    });
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
      map((button) => {
        if(button.eventStart)
        {
          button.eventStart = new Date(button.eventStart)
        }
        if(button.eventEnd)
        {
          button.eventEnd = new Date(button.eventEnd)
        }
        this.onSuccess(button)
      }),
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
      if(this.filters?.where.center)
      {
        const newZoom = getZoomFromRadius(this.filters.where.radius)
        newState.explore.settings.zoom = newZoom 
        newState.explore.settings.center = this.filters.where.center
      }
      newState.explore.map.filters = this.filters;
    });
  }
}

const getZoomFromRadius = (radius) => {
  if (radius > 300)
  {
    return 7
  }else if (radius > 200)
  {
    return 8
  }else if (radius > 100)
  {
    return 9
  }else if (radius > 50)
  {
    return 10
  }else if (radius > 25)
  {
    return 11
  }else if (radius > 15)
  {
    return 12
  }else if (radius > 5)
  {
    return 13
  }else{
    return 15
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

export class UpdateHexagonClicked implements UpdateEvent {
  public constructor(private listButtons: Button[], private hexagonClicked: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.listButtons = this.listButtons;
      newState.explore.map.loading = false;
      newState.explore.map.initialized = true;
      newState.explore.settings.hexagonClicked = this.hexagonClicked;
    });
  }
}


export class clearHexagonClicked implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.listButtons = state.explore.map.boundsFilteredButtons;
      newState.explore.map.loading = false;
      newState.explore.map.initialized = true;
      newState.explore.settings.hexagonClicked = null;
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
      const newExploreSettings = {
        ...prevSettings,
        prevZoom: prevSettings.zoom,
        ...this.newExploreSettings,
        loading: false,
      };
      newState.explore.settings = newExploreSettings;
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


export class GetPhone implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.getPhone(this.buttonId).pipe(
      map((data) => {
        this.onSuccess(data);
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class ButtonUpdateModifiedDate implements WatchEvent{
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.renew(this.buttonId).pipe(
      map((data) => {
        this.onSuccess(data);
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}