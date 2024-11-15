import { map, catchError, tap } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';

import { ButtonService } from 'services/Buttons';
import { GlobalState, store } from 'pages';
import { Button } from 'shared/entities/button.entity';
import { GeoService } from 'services/Geo';
import { UpdateButtonDto } from 'shared/dtos/feed-button.dto';
import { handleError } from './helper';

import {
  ButtonFilters,
  defaultFilters,
} from 'components/search/AdvancedFilters/filters.type';
import { Bounds } from 'pigeon-maps';
import { cellToZoom, getZoomResolution, roundCoords } from 'shared/honeycomb.utils';
import { cellToParent, getResolution } from 'h3-js';
import { of } from 'rxjs';
import { ButtonsOrderBy } from 'components/search/AdvancedFilters';
import { maxZoom } from 'components/map/Map/Map.consts';
import _ from 'lodash';
import { nextElement, previousElement } from 'shared/sys.helper';


export enum ExploreViewMode {
  BOTH = 'both',
  MAP = 'map',
  LIST = 'list',
}
export interface ExploreState {
  draftButton: any;
  currentButton: Button;
  activityCurrentButton: Button;
  map: ExploreMapState;
  settings: ExploreSettings;
}

export interface ExploreSettings {
  center: number[];
  zoom: number;
  prevZoom: number;
  prevCenter: number[];
  bounds: Bounds;
  honeyCombFeatures: any;
  loading: boolean;
  hexagonClicked: string;
  hexagonHighlight: string;
  viewMode: ExploreViewMode;
  urlUpdated: boolean;
}

export const exploreSettingsDefault: ExploreSettings = {
  center: null,
  zoom: 4,
  prevCenter: null,
  prevZoom: 4,
  bounds: null,
  honeyCombFeatures: null,
  loading: true,
  hexagonClicked: null,
  hexagonHighlight: null,
  viewMode: ExploreViewMode.BOTH,
  urlUpdated: false,
};
export interface ExploreMapState {
  filters: ButtonFilters;
  buttonTypeClicked: boolean; // this is used to jump to center of network if no buttons are found
  listButtons: Button[]; // if hexagon clicked, can be different from boundsButtons
  boundsFilteredButtons: Button[];
  cachedHexagons: any[];
  loading: boolean;
  initialized: boolean;
  showAdvancedFilters: boolean;
  showInstructions: boolean;
  allTags: string[]
}
export const exploreInitial = {
  draftButton: null,
  currentButton: null,
  map: {
    filters: defaultFilters,
    listButtons: [], // if hexagon clicked, can be different from boundsButtons
    boundsFilteredButtons: [],
    cachedHexagons: [],
    loading: true,
    initialized: false,
    showAdvancedFilters: false,
    showInstructions: true,
    allTags: []
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
      map((buttons) => {
        store.emit(new UpdateTagsList(buttons))
        return this.onSuccess(buttons)
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.loading = true;
    });
  }
}

export class UpdateTagsList implements UpdateEvent{
  public constructor(
    private buttons: Button[]
  ) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      const allTags = this.buttons.map((button) => button.tags)
      newState.explore.map.allTags = _.uniq([..._.flattenDeep(allTags),... state.explore.map.allTags])
    });
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
      newState.explore.map.filters = defaultFilters
      newState.explore.map.showAdvancedFilters = false
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
    private onSuccess = (button) => {},
    private onError = () => {},
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

export class ButtonDelete implements WatchEvent, UpdateEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return ButtonService.delete(this.buttonId).pipe(
      map((res) => {
        store.emit(new updateCurrentButton(null))
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
      tap((data) => {
        store.emit(new updateCurrentButton(data[0]))
        this.onSuccess(data[0]);
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

export class NextCurrentButton implements UpdateEvent{
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      const nextButton = nextElement(state.explore.currentButton.id, state.explore.map.listButtons)
      if(nextButton)
      {
        newState.explore.currentButton = nextButton;
      }
    })
  }
}

export class PreviousCurrentButton implements UpdateEvent{
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      const previousButton = previousElement(state.explore.currentButton.id, state.explore.map.listButtons)
      if(previousButton)
      {
        newState.explore.currentButton = previousButton;
      }
    })
  }
}


export class setActivityCurrentButton implements UpdateEvent {
  public constructor(private button: Button) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.activityCurrentButton = this.button;
    });
  }
}


export class updateCurrentButton implements UpdateEvent {
  public constructor(private button: Button) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton = this.button;
      if(this.button)
    {
      newState.explore.settings.prevCenter = state.explore.settings.center
      newState.explore.settings.prevZoom = state.explore.settings.zoom
      
      if(this.button.hideAddress)
      {
        newState.explore.settings.hexagonClicked = this.button.hexagon
      }
      
      newState.explore.settings.center = roundCoords([this.button.latitude, this.button.longitude])
      newState.explore.settings.zoom = maxZoom-1

    }else if(!this.button){
      newState.explore.settings.center = state.explore.settings.prevCenter
      newState.explore.settings.zoom = state.explore.settings.prevZoom
    }
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
      let newFilters = this.filters;
      const words = this.filters.query.split(' ')
      const tagsFound = words.map((word) => {
        return state.explore.map.allTags.find((tag) => tag == word)
      }).filter((tag) => tag)

      const newQuery = words.map((word) => {
        if(state.explore.map.allTags.find((tag) => tag == word))
        {
          return ''
        }
        return word
      }).join(' ')

      newFilters.tags = _.uniq([...tagsFound, ...this.filters.tags])
      newFilters.query = newQuery
      newState.explore.map.filters = newFilters;
    });
  }
}

export class ResetFilters implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {      newState.explore.map.filters = defaultFilters;
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
        tags:  [this.tag]
      };
    });
  }
}

export class UpdateFiltersToFilterButtonType implements UpdateEvent {
  public constructor(private buttonType: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.buttonTypeClicked = true;

      let newFilters = {
        ...defaultFilters,
        helpButtonTypes: [this.buttonType],
      };

      if (state?.networks && state.networks?.selectedNetwork) {
        const btnType =
          state.networks.selectedNetwork.buttonTemplates.find(
            (buttonType) => {
              return buttonType.name == this.buttonType;
            },
          );

        if (btnType?.customFields) {
          const btnTypeEvents = btnType.customFields.find(
            (customField) => customField.type == 'event',
          );
          if (btnTypeEvents) {
            newFilters.orderBy = ButtonsOrderBy.EVENT_DATE;
          }
        }
      }
      newState.explore.map.filters = newFilters;
    });
  }
}

export class UpdateBoundsFilteredButtons implements UpdateEvent, WatchEvent {
  public constructor(private boundsFilteredButtons: Button[]) {}

  public watch(state: GlobalState) {

    /** this functionality is used so that when a button type is clicked, and no buttons are found the map will be recentered */
    if (state.explore.map.buttonTypeClicked) {
      store.emit(new ResetButtonTypeClicked())
      if (
        this.boundsFilteredButtons.length < 1 &&
        state.explore.map.filters.helpButtonTypes.length == 1 &&
        state.networks.selectedNetwork?.exploreSettings
      ) {
        if (
          state.explore.settings.zoom !=
            state.networks.selectedNetwork.exploreSettings.zoom ||
          JSON.stringify(state.explore.settings.center) !=
            JSON.stringify(
              state.networks.selectedNetwork.exploreSettings.center,
            )
        ) {
          store.emit(
            new UpdateExploreSettings({
              center:
                state.networks.selectedNetwork.exploreSettings.center,
              zoom: state.networks.selectedNetwork.exploreSettings
                .zoom,
            }),
          );
        }
      }
    }
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.boundsFilteredButtons =
        this.boundsFilteredButtons;
      newState.explore.map.listButtons = listButtonsFilteredByHexagon(state.explore.settings.hexagonClicked, this.boundsFilteredButtons)
      newState.explore.map.loading = false;
      newState.explore.map.initialized = true;
    });
  }
}
export class ResetButtonTypeClicked implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.buttonTypeClicked = false;
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
  public constructor(private hexagonClicked: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.settings.hexagonClicked = this.hexagonClicked;
      if(this.hexagonClicked)
      {
        newState.explore.map.showInstructions = false;
        newState.explore.map.listButtons = listButtonsFilteredByHexagon(this.hexagonClicked, state.explore.map.boundsFilteredButtons)
        newState.explore.currentButton = null
        if(state.explore.settings.viewMode == ExploreViewMode.MAP)
        {
          newState.explore.settings.viewMode = ExploreViewMode.BOTH
        }
      }else{
        newState.explore.map.listButtons = state.explore.map.boundsFilteredButtons
      }
    });
  }
}


export class HiglightHexagonFromButton implements UpdateEvent {
  public constructor(private buttonHexagon: string) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      if(this.buttonHexagon)
      {
        newState.explore.settings.hexagonHighlight = cellToZoom(this.buttonHexagon, state.explore.settings.zoom)
      }else{
        newState.explore.settings.hexagonHighlight = null
      }
    });
  }
}

function listButtonsFilteredByHexagon(hexagonClicked, boundsFilteredButtons) {
  const resolutionRequested = getResolution(hexagonClicked);
  if (hexagonClicked)
  {
    return boundsFilteredButtons.filter(
      (button) =>
        cellToParent(button.hexagon, resolutionRequested) ==
        hexagonClicked,
    );
  }
  return boundsFilteredButtons
  
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
  public watch(state: GlobalState) {
      if (this.newExploreSettings?.zoom &&
        getResolution(state.explore.settings.hexagonClicked) !=
          getZoomResolution(Math.floor(this.newExploreSettings.zoom))
      ) {
        
        store.emit(new UpdateHexagonClicked(null))
      }
      return of(undefined)
  }

  public update(state: GlobalState) {

    return produce(state, (newState) => {
      const prevSettings = state.explore.settings;

      let newExploreSettings = {
        loading: false,
      };
      
      if (this.newExploreSettings.center)
      {
        newExploreSettings = {center: roundCoords(this.newExploreSettings.center), ...newExploreSettings}
      }


      newExploreSettings = {zoom: this.newExploreSettings.zoom, ...newExploreSettings}
        
      if (!state.explore.currentButton)
      {
        newExploreSettings = {prevZoom: state.explore.settings.zoom, prevCenter: state.explore.settings.center, ...newExploreSettings}
      }
      if(prevSettings.center != null && JSON.stringify(prevSettings.center) != JSON.stringify(this.newExploreSettings.center))
      {
        newState.explore.map.showInstructions = false;
      }
      newState.explore.settings = {...state.explore.settings,...newExploreSettings};
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

export class ButtonRenew implements WatchEvent{
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

export class ToggleAdvancedFilters implements UpdateEvent {
  public constructor(private value?) {}  

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      if(this.value === false || this.value === true)
      {
        newState.explore.map.showAdvancedFilters = this.value
      }else{
        newState.explore.map.showAdvancedFilters = !state.explore.map.showAdvancedFilters
      }
    });
  }
}

export class RecenterExplore implements WatchEvent {
  public constructor(private value?) {}  
  public watch( state: GlobalState)
  {
    if(state?.networks?.selectedNetwork?.exploreSettings)
    {
      store.emit(new UpdateExploreSettings({zoom: state.networks.selectedNetwork.exploreSettings.zoom,center: state.networks.selectedNetwork.exploreSettings.center }))
    }
  }
}


export class UpdateExploreViewMode implements UpdateEvent{
  public constructor(private viewMode: ExploreViewMode) {}  

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.settings.viewMode = this.viewMode
    });
  }
}