//EXPLORE MAP
import React, { useState, useEffect } from 'react';

//components
import {
  ExploreMapState,
  FindButtons,
  UpdateBoundsFilteredButtons,
  UpdateCachedHexagons,
  UpdateExploreUpdating,
  UpdateQueryFoundTags,
  UpdateExploreSettings,
  ExploreSettings,
  ClearCachedHexagons,
  UpdateHexagonClicked,
  updateCurrentButton,
  FindButton,
  UpdateFilters,
} from 'state/Explore';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { withRouter } from 'next/router';
import List from 'components/list/List';
import { Point } from 'pigeon-maps';
import HexagonExploreMap from 'components/map/Map/HexagonExploreMap';
import {
  calculateDensityMap,
  cellToZoom,
  convertBoundsToGeoJsonHexagons,
  getZoomResolution,
  recalculateDensityMap,
  roundCoord,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { useDebounce, useToggle } from 'shared/custom.hooks';
import AdvancedFilters, {
  ButtonsOrderBy,
} from 'components/search/AdvancedFilters';
import { Button } from 'shared/entities/button.entity';
import { getDistance, isPointWithinRadius } from 'geolib';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import {
  getLocale,
  getUrlParams,
  uniqueArray,
} from 'shared/sys.helper';
import {
  applyCustomFieldsFilters,
  orderByEventDate,
  orderByPrice,
} from 'components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields';
import PopupButtonFile from 'components/popup/PopupButtonFile';
import { alertService } from 'services/Alert';
import t from 'i18n';
import { ButtonShow } from 'components/button/ButtonShow';

const defaultZoomPlace = 13;

function HoneyComb({ router, selectedNetwork }) {
  const currentButton = useStore(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );

  const exploreMapState: ExploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false,
  );

  const exploreSettings: ExploreSettings = useStore(
    store,
    (state: GlobalState) => state.explore.settings,
    false,
  );
  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
    false
  );
  const [showLeftColumn, toggleShowLeftColumn] = useToggle(true);
  const [showMap, toggleShowMap] = useToggle(true);


  useExploreSettings({
    exploreSettings,
    router,
    selectedNetwork,
    currentButton,
    filters,
  });

  const {
    handleBoundsChange,
    h3TypeDensityHexes,
  } = useHexagonMap({
    toggleShowLeftColumn,
    exploreSettings,
    filters: exploreMapState.filters,
    boundsFilteredButtons: exploreMapState.boundsFilteredButtons,
    cachedHexagons: exploreMapState.cachedHexagons,
    buttonTypes: selectedNetwork?.buttonTemplates,
  });

  return (
    <>
    
    <div className="index__explore-container">
        <div
          className={
            'index__content-left ' +
            (showLeftColumn ? '' : 'index__content-left--hide')
          }
        >         
          <ShowMobileOnly>
            <NavHeader selectedNetwork={selectedNetwork}/>
          </ShowMobileOnly>
         <AdvancedFilters/>

          {currentButton && (
            <PopupButtonFile
              linkBack={() => {
                store.emit(new updateCurrentButton(null));
              }}
            >
              {selectedNetwork.buttonTemplates?.length > 0 && (
                  <ButtonShow
                    currentButton={currentButton}
                    buttonTypes={selectedNetwork.buttonTemplates}
                  />
              )}
            </PopupButtonFile>
          )}

          <ShowDesktopOnly>
            <List
              buttons={exploreMapState.listButtons}
              showLeftColumn={showLeftColumn}
              onLeftColumnToggle={toggleShowLeftColumn}
              showMap={true} 
            />
          </ShowDesktopOnly>
        </div>
          <DisplayInstructions/>
          <HexagonExploreMap
            exploreSettings={exploreSettings}
            h3TypeDensityHexes={h3TypeDensityHexes}
            handleBoundsChange={handleBoundsChange}
            selectedNetwork={selectedNetwork}
          />
        <ShowMobileOnly>
          <div
            className={
              'index__content-bottom ' +
              (showMap ? '' : 'index__content-bottom') +
              (showLeftColumn ? '' : 'index__content-bottom--hide')
            }
          >
            <List
              buttons={exploreMapState.listButtons}
              showLeftColumn={showLeftColumn}
              showMap={showMap}
              toggleShowMap={toggleShowMap}
              onLeftColumnToggle={toggleShowLeftColumn}
            />
          </div>
        </ShowMobileOnly>
      </div>
    </>
  );
}

export default withRouter(HoneyComb);

function useExploreSettings({
  router,
  selectedNetwork,
  exploreSettings,
  currentButton,
  filters
}) {
  let URLParamsCoords = false;

  useEffect(() => {
    if (router && router.asPath) {
      const params = getUrlParams(router.asPath, router);

      const lat = parseFloat(params.get('lat'));
      const lng = parseFloat(params.get('lng'));
      const zoom = parseInt(params.get('zoom'));
      const btnId = params.get('btn');
      const hex = params.get('hex')

      let newFilters = null;
      if(params.has('q'))
      {
        newFilters = {...newFilters, query: params.get('q')}
      }
      if(params.has('orderBy'))
      {
        newFilters = {...newFilters, orderBy: params.get('orderBy')}
      }
      if(params.has('hbTypes'))
      {

        const hbTypes = params.get('hbTypes').split(',');
        
        const buttonTypes = hbTypes.map((_buttonTypeSelected) => 
        {
          const btnType = selectedNetwork.buttonTemplates.find((_btnType) => _btnType.name == _buttonTypeSelected)
          console.log('sel:')
          console.log(btnType)
          if (btnType?.customFields) {
            const btnTypeEvents = btnType.customFields.find(
              (customField) => customField.type == 'event',
            );
            if (btnTypeEvents) {
              newFilters = {...newFilters, orderBy: ButtonsOrderBy.EVENT_DATE}

            }
          }
        
        })
        newFilters = {...newFilters, helpButtonTypes: hbTypes}
      }
      
      if(hex)
      {
        store.emit(new UpdateHexagonClicked(cellToZoom(hex, exploreSettings.zoom)))
      }
      
      if(newFilters)
      {
        store.emit(new UpdateFilters({...filters, ...newFilters}))
      }

      if (lat && lng) {
        URLParamsCoords = true;
        let newUpdateSettings = { center: [lat, lng] };
        if (Number.isInteger(zoom)) {
          newUpdateSettings = { ...newUpdateSettings, zoom: zoom };
        }
        store.emit(new UpdateExploreSettings(newUpdateSettings));
      }
      if (btnId) {
        store.emit(
          new FindButton(
            btnId,
            (buttonFetched) => {
              store.emit(new updateCurrentButton(buttonFetched));
            },
            (errorMessage) => {
              alertService.error(errorMessage.caption);
            },
          ),
        );
      } else {
        store.emit(new updateCurrentButton(null));
      }
    }
  }, []);
  useEffect(() => {
    if (selectedNetwork && exploreSettings) {
      if (exploreSettings?.center == null && !URLParamsCoords) {
        store.emit(
          new UpdateExploreSettings({
            center: selectedNetwork.exploreSettings.center,
            zoom: selectedNetwork.exploreSettings.zoom,
            loading: true,
          }),
        );
      }
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (exploreSettings?.center && !URLParamsCoords && filters) {
      let obj = {};
      const urlParams = new URLSearchParams()

      urlParams.append('zoom', Math.floor(exploreSettings.zoom));
      urlParams.append('lat', roundCoord(exploreSettings.center[0]));
      urlParams.append('lng', roundCoord(exploreSettings.center[1]));
      obj = {
        zoom: exploreSettings.zoom,
        lat: exploreSettings.center[0],
        lng: exploreSettings.center[1],
      };

      if (currentButton) {
        obj = { ...obj, btn: currentButton.id };
        urlParams.append('btn', currentButton.id);
      }

      if(filters.helpButtonTypes.length > 0){
        urlParams.append('hbTypes', filters.helpButtonTypes)
      }

      if(filters.query.length > 0){
        urlParams.append('q', filters.query)
      }

      if(filters.orderBy != 'date')
      {
        urlParams.append('orderBy', filters.orderBy)
      }
      const locale = getLocale() == 'en' ? '' : `/${getLocale()}`;
      window.history.pushState(
        obj,
        'Title',
        `${locale}/Explore?${urlParams.toString()}`,
      );
    }
    
  }, [exploreSettings, currentButton, filters]);
}

store.emit(new ClearCachedHexagons());

function useHexagonMap({
  toggleShowLeftColumn,
  exploreSettings,
  filters,
  boundsFilteredButtons,
  cachedHexagons,
  buttonTypes,
}) {

  const [hexagonsToFetch, setHexagonsToFetch] = useState({
    resolution: 1,
    hexagons: [],
  });
  const debounceHexagonsToFetch = useDebounce(hexagonsToFetch, 100);

  const foundTags = React.useRef([]);
  const [h3TypeDensityHexes, seth3TypeDensityHexes] = useState([]);
  let cachedH3Hexes = React.useRef(cachedHexagons);
  useEffect(() => {
    if(cachedHexagons.length < 1 && exploreSettings.bounds)
    {
      
      cachedH3Hexes.current = []
      fetchBounds(exploreSettings.bounds, exploreSettings.zoom)
    }
  }, [cachedHexagons])
  const calculateNonCachedHexagons = (
    debounceHexagonsToFetch,
    cachedH3Hexes,
  ) => {
    return debounceHexagonsToFetch.hexagons.reduce(
      (hexagonsToFetch, hexagon) => {
        const cacheHit = cachedH3Hexes.current.find(
          (cachedHex) => cachedHex.hexagon == hexagon,
        );
        if (!cacheHit) {
          hexagonsToFetch.push(hexagon);
        }
        return hexagonsToFetch;
      },
      [],
    );
  };

  const recalculateCacheH3Hexes = (newDensityMapHexagons) => {
    cachedH3Hexes.current = uniqueArray([
      ...cachedH3Hexes.current,
      ...newDensityMapHexagons,
    ]);
    store.emit(new UpdateCachedHexagons(cachedH3Hexes.current));
  };

  useEffect(() => {
    if (debounceHexagonsToFetch.hexagons.length > 0) {
      const hexesToFetch = calculateNonCachedHexagons(
        debounceHexagonsToFetch,
        cachedH3Hexes,
      );
      if (hexesToFetch.length > 0) {
        store.emit(new UpdateExploreUpdating());
        store.emit(
          new FindButtons(
            debounceHexagonsToFetch.resolution,
            hexesToFetch,
            (buttons) => {
              const newDensityMapHexagons = calculateDensityMap(
                buttons,
                debounceHexagonsToFetch.resolution,
                hexesToFetch,
              );
              recalculateCacheH3Hexes(newDensityMapHexagons);
              updateDensityMap();
            },
            (error) => {
              console.error(error);
            },
          ),
        );
      } else {
        updateDensityMap();
      }
    }
  }, [debounceHexagonsToFetch]);

  function updateDensityMap() {
    if (exploreSettings.loading) {
      return;
    }
    store.emit(new UpdateExploreUpdating());
    const boundsButtons = cachedH3Hexes.current.filter(
      (cachedHex) => {
        return debounceHexagonsToFetch.hexagons.find(
          (hexagon) => hexagon == cachedHex.hexagon,
        );
      },
    );
    const { filteredButtons, filteredHexagons } = applyFilters(
      filters,
      boundsButtons,
    );

    const orderedFilteredButtons = orderBy(
      filteredButtons,
      filters.orderBy,
      exploreSettings.center,
    );

    seth3TypeDensityHexes(() => {
      return filteredHexagons;
    });

    store.emit(
      new UpdateBoundsFilteredButtons(orderedFilteredButtons),
    );
  }

  useEffect(() => {
    updateDensityMap();
  }, [filters]);

  const applyFilters = (filters, cachedHexagons) => {
    const applyButtonTypesFilter = (button, buttonTypes) => {
      if (buttonTypes.length == 0) {
        return true;
      }
      if (buttonTypes.length > 0) {
        return buttonTypes.indexOf(button.type) > -1;
      }
      return false;
    };

    const applyQueryFilter = (button, query) => {
      if (query && query.length > 0) {
        return (
          button.title.indexOf(query) > -1 ||
          button.description.indexOf(query) > -1
        );
      }
      return true;
    };

    const applyWhereFilter = (button: Button, where) => {
      if (where.center && where.radius) {
        return isPointWithinRadius(
          { latitude: button.latitude, longitude: button.longitude },
          { latitude: where.center[0], longitude: where.center[1] },
          where.radius * 1000,
        );
      }
      return true;
    };

    const applyTagFilters = (button: Button, tags: string[]) => {
      if (tags.length == 0) {
        return true;
      }
      if (tags.length > 0) {
        const tagsFound = _.intersection(tags, button.tags);
        if (tagsFound.length > 0) {
          return true;
        }
      }
      return false;
    };

    const findMoreTags = (button: Button, queryTags) => {
      const tagsFound = _.intersection(queryTags, button.tags);
      if (tagsFound.length > 0) {
        foundTags.current = _.union(foundTags.current, tagsFound);
      }
    };

    let queryTags = filters.query
      .split(' ')
      .filter((value) => value.length > 0);
    foundTags.current = [];

    const res = cachedHexagons.reduce(
      ({ filteredButtons, filteredHexagons }, hexagonCached) => {
        const moreButtons = hexagonCached.buttons.filter(
          (button: Button) => {
            if (
              !applyButtonTypesFilter(button, filters.helpButtonTypes)
            ) {
              return false;
            }

            findMoreTags(button, queryTags);
            if (!applyTagFilters(button, foundTags.current)) {
              return false;
            }

            // remove tags from query string, so it won't fail to search string
            let query = filters.query;
            foundTags.current.forEach(
              (tag) => (query = query.replace(tag, '')),
            );
            if (!applyQueryFilter(button, query)) {
              return false;
            }
            if (!applyWhereFilter(button, filters.where)) {
              return false;
            }
            if (
              !applyCustomFieldsFilters(button, filters, buttonTypes)
            ) {
              return false;
            }
            return true;
          },
        );

        filteredHexagons.push({
          ...hexagonCached,
          buttons: moreButtons,
        });
        return {
          filteredButtons: filteredButtons.concat(moreButtons),
          filteredHexagons: filteredHexagons,
        };
      },
      { filteredButtons: [], filteredHexagons: [] },
    );

    store.emit(new UpdateQueryFoundTags(foundTags.current));
    return {
      filteredButtons: res.filteredButtons,
      filteredHexagons: recalculateDensityMap(res.filteredHexagons),
    };
  };

  const handleBoundsChange = (bounds, center: Point, zoom) => {
    if (bounds) {
      store.emit(
        new UpdateExploreSettings({
          zoom: zoom,
          bounds: bounds,
          loading: true,
          center: center,
        }),
      );

      fetchBounds(bounds, zoom)
    }
  };

  const fetchBounds = (bounds, zoom) => {
    const zoomFloor = Math.floor(zoom)
    const hexagonsForBounds = convertBoundsToGeoJsonHexagons(
      bounds,
      getZoomResolution(zoomFloor),
    );
    if (hexagonsForBounds.length > 1000) {
      console.error('too many hexes.. canceling..');
      return;
    }
    setHexagonsToFetch(() => {return {
      resolution: getZoomResolution(zoomFloor),
      hexagons: hexagonsForBounds,
    }});
  }
  return {
    handleBoundsChange,
    setHexagonsToFetch,
    h3TypeDensityHexes,
  };
}

const orderByClosestToCenter = (center, buttons) => {
  function buttonDistance(buttonA, buttonB) {
    if(buttonA.distance < buttonB.distance)
    {
      return -1;
    }else if(buttonA.distance == buttonB.distance)
    {
      return 0;
    }
    return 1
  }

  if (!center) {
    return buttons;
  }
  const buttonsDistance = buttons.map((button) => {
    const distance = getDistance(
      { latitude: button.latitude, longitude: button.longitude },
      {
        latitude: center[0],
        longitude: center[1],
      },
    );
    return { ...button, distance };
  });

  return buttonsDistance.sort(buttonDistance);
};

export const orderByCreated = (buttons) => {
  return [...buttons].sort(
    (buttonA, buttonB) => {
      if(buttonA.created_at < buttonB.created_at)
      {
        return 1
      }else if (buttonA.created_at == buttonB.created_at){
        return 0
      }
      return -1
    });
};

const orderBy = (buttons, orderBy, center) => {
  if (orderBy == ButtonsOrderBy.PROXIMITY) {
    return orderByClosestToCenter(center, buttons);
  }
  if (orderBy == ButtonsOrderBy.DATE) {
    return orderByCreated(buttons);
  }
  if (orderBy == ButtonsOrderBy.PRICE) {
    return orderByPrice(buttons);
  }
  if (orderBy == ButtonsOrderBy.EVENT_DATE) {
    return orderByEventDate(buttons);
  }
  return buttons;
};


function DisplayInstructions() {
  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
    false,
  );
  const showInstructions = useStore(
    store,
    (state: GlobalState) => state.explore.map.showInstructions,
    false,
  );
  return (
    <>
      {(showInstructions && !loggedInUser ) && (
        <div className="search-map__instructions">
          {t('explore.displayInstructions')}
        </div>
      )}
    </>
  );
}