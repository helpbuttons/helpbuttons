//EXPLORE MAP
import React, { useState, useEffect } from 'react';

//components
import {
  ExploreMapState,
  FindButtons,
  UpdateBoundsFilteredButtons,
  UpdateCachedHexagons,
  UpdateExploreUpdating,
  UpdateExploreSettings,
  ExploreSettings,
  ClearCachedHexagons,
  UpdateHexagonClicked,
  updateCurrentButton,
  FindButton,
  UpdateFilters,
  RecenterExplore,
} from 'state/Explore';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import { useStore } from 'state';
import { GlobalState, store, useGlobalStore } from 'state';
import router from 'next/router';
import List from 'components/list/List';
import { Point } from 'pigeon-maps';
import HexagonExploreMap from 'components/map/Map/HexagonExploreMap';
import {
  calculateDensityMap,
  cellToZoom,
  convertBoundsToGeoJsonHexagons,
  getZoomResolution,
} from 'shared/honeycomb.utils';
import _, { update } from 'lodash';
import {
  useBackButton,
  useDebounce,
  useToggle,
} from 'shared/custom.hooks';
import AdvancedFilters, {
  ButtonsOrderBy,
} from 'components/search/AdvancedFilters';
import { getDistance, isPointWithinRadius } from 'geolib';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import { uniqueArray } from 'shared/sys.helper';
import {
  orderByEventDate,
  orderByPrice,
} from 'components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields';
import PopupButtonFile from 'components/popup/PopupButtonFile';
import { alertService } from 'services/Alert';
import { ButtonShow } from 'components/button/ButtonShow';
import { maxZoom, minZoom, showMarkersZoom } from 'components/map/Map/Map.consts';
import { applyFiltersHex, isFiltering } from 'components/search/AdvancedFilters/filters.type';
import { Button } from 'shared/entities/button.entity';
import { filter } from 'rxjs';
import dconsole from 'shared/debugger';
import { updateUrl } from 'components/uri/builder';
import { useSearchParams } from 'next/navigation';
import t from 'i18n';
import { CardSubmenuOption } from 'components/card/CardSubmenu';

const defaultZoomPlace = 13;

function HoneyComb({ selectedNetwork }) {
  const currentButton = useStore(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );
  
  const listButtons : Button[] = useStore(
    store,
    (state: GlobalState) => state.explore.map.listButtons,
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
    false,
  );
  const [showLeftColumn, toggleShowLeftColumn] = useToggle(true);
  const [showMap, toggleShowMap] = useToggle(true);
  const [isListOpen, setListOpen] = useState<boolean>(true);

  useExploreSettings({
    exploreSettings,
    router,
    selectedNetwork,
    currentButton,
    filters,
  });


  return (
    <>
      <ShowDesktopOnly>
        <AdvancedFilters />
        <ExploreContainer>
          <ExploreContainerLeftColumn showLeftColumn={showLeftColumn}>
            {currentButton && (
              <PopupButtonFile
                linkBack={() => {
                  store.emit(new updateCurrentButton(null));
                }}
              >
                {selectedNetwork.buttonTemplates?.length > 0 && (
                  <ButtonShow button={currentButton} />
                )}
              </PopupButtonFile>
            )}
            <ExploreContainerList
             listButtons={listButtons}
             showLeftColumn={showLeftColumn}
             showMap={true}
             isListOpen={isListOpen}
             setListOpen={setListOpen}
             toggleShowMap={toggleShowMap}
             toggleShowLeftColumn={toggleShowLeftColumn}
            />
          </ExploreContainerLeftColumn>
          <ExploreHexagonMap toggleShowLeftColumn={toggleShowLeftColumn} exploreSettings={exploreSettings} selectedNetwork={selectedNetwork}/>
          
        </ExploreContainer>
      </ShowDesktopOnly>
      <ShowMobileOnly>
        <ExploreContainer>
          <ExploreContainerLeftColumn showLeftColumn={showLeftColumn}>
            <NavHeader selectedNetwork={selectedNetwork} />
            <AdvancedFilters />
            {currentButton && (
              <PopupButtonFile
                linkBack={() => {
                  store.emit(new updateCurrentButton(null));
                }}
              >
                <ButtonShow button={currentButton} />
              </PopupButtonFile>
            )}
          </ExploreContainerLeftColumn>
          <ExploreHexagonMap toggleShowLeftColumn={toggleShowLeftColumn} exploreSettings={exploreSettings} selectedNetwork={selectedNetwork}/>
          <div
          className={
            'index__content-bottom ' +
            (showMap ? '' : 'index__content-bottom') +
            (isListOpen
              ? ' index__content-bottom--mid-screen'
              : '') +
            (showLeftColumn ? '' : ' index__content-bottom--hide') +
            (currentButton
              ? ' index__content-bottom--noscroll'
              : '')
          }
        >
          <ExploreContainerList
             listButtons={listButtons}
             showLeftColumn={showLeftColumn}
             showMap={showMap}
             isListOpen={isListOpen}
             setListOpen={setListOpen}
             toggleShowMap={toggleShowMap}
             toggleShowLeftColumn={toggleShowLeftColumn}
          />
        </div>
        </ExploreContainer>
        
    </ShowMobileOnly >
    </>
  );
}

// export default withRouter(HoneyComb);
export default HoneyComb;

function useExploreSettings({
  router,
  selectedNetwork,
  exploreSettings,
  currentButton,
  filters,
}) {
  const handleBackButton = () => {
    handleUrl();
  };

  useBackButton(handleBackButton);

  const handleUrl = () => {
    const params = new URLSearchParams(window.location.search);

    const btnId = params.get('btn');
    const hex = params.get('hex');

    let newFilters = null;
    if (params.has('q')) {
      newFilters = { ...newFilters, query: params.get('q') };
    }
    if (params.has('tags')) {
      newFilters = {
        ...newFilters,
        tags: params.get('tags').split(','),
      };
    }
    if (params.has('orderBy')) {
      newFilters = { ...newFilters, orderBy: params.get('orderBy') };
    }
    if (params.has('hbTypes')) {
      const hbTypes = params.get('hbTypes').split(',');

      const buttonTypes = hbTypes.map((_buttonTypeSelected) => {
        const btnType = selectedNetwork.buttonTemplates.find(
          (_btnType) => _btnType.name == _buttonTypeSelected,
        );
        if (btnType?.customFields) {
          const btnTypeEvents = btnType.customFields.find(
            (customField) => customField.type == 'event',
          );
          if (btnTypeEvents) {
            newFilters = {
              ...newFilters,
              orderBy: ButtonsOrderBy.EVENT_DATE,
            };
          }
        }
      });
      newFilters = { ...newFilters, helpButtonTypes: hbTypes };
    }

    if (hex) {
      store.emit(
        new UpdateHexagonClicked(
          cellToZoom(hex, exploreSettings.zoom),
        ),
      );
    }

    if (newFilters) {
      store.emit(new UpdateFilters({ ...filters, ...newFilters }));
    }
    if (btnId) {
      store.emit(
        new FindButton(
          btnId,
          (buttonFetched) => {
            store.emit(new updateCurrentButton(buttonFetched));
          },
          (errorMessage) => {
            dconsole.error(errorMessage);
            alertService.error(`Error fetching button`);
          },
        ),
      );
    }
  };
  useEffect(() => {
    if (selectedNetwork && exploreSettings) {
      handleUrl();
    }
  }, [selectedNetwork]);

  const currentProfile = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupUserProfile)
  const currentUrlParams = useSearchParams();
  const hasSelectedButton = currentUrlParams.has('btn')
  useEffect(() => {
    if (!hasSelectedButton) {
      store.emit(new updateCurrentButton(null))
    }
  }, [hasSelectedButton])

  useEffect(() => {
    if (
      exploreSettings?.center &&
      !exploreSettings.urlUpdated &&
      filters &&
      !currentProfile
    ) {
      let obj = {};

      if (currentButton) {
        obj = { ...obj, btn: currentButton.id };
      }

      if (filters.helpButtonTypes.length > 0) {
        obj = { ...obj, hbTypes: filters.helpButtonTypes };
      }

      if (filters.query.length > 0) {
        obj = { ...obj, q: filters.query };
      }

      if (filters.tags.length > 0) {
        obj = { ...obj, tags: filters.tags };
      }

      if (filters.orderBy != 'date') {
        obj = { ...obj, orderBy: filters.orderBy };
      }

      const urlParams = new URLSearchParams(obj);
      const newUrl = `/Explore/${Math.floor(exploreSettings.zoom)}/${exploreSettings.center[0]
        }/${exploreSettings.center[1]}/?${urlParams.toString()}`;
        router.push(
          newUrl,
          undefined,
          { shallow: true }
        );
      }
  }, [exploreSettings, currentButton, filters, currentProfile]);
}


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
    if (cachedHexagons.length < 1 && exploreSettings.bounds) {
      cachedH3Hexes.current = [];
      fetchBounds(exploreSettings.bounds, exploreSettings.zoom);
    }
  }, [cachedHexagons]);
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
    const { filteredButtons, filteredHexagons } = applyFiltersHex(
      filters,
      boundsButtons,
      buttonTypes,
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

      fetchBounds(bounds, zoom);
    }
  };

  const fetchBounds = (bounds, zoom) => {
    const zoomFloor = Math.floor(zoom);
    const hexagonsForBounds = convertBoundsToGeoJsonHexagons(
      bounds,
      getZoomResolution(zoomFloor),
    );
    setHexagonsToFetch(() => {
      return {
        resolution: getZoomResolution(zoomFloor),
        hexagons: hexagonsForBounds,
      };
    });
  };
  return {
    handleBoundsChange,
    setHexagonsToFetch,
    h3TypeDensityHexes,
  };
}

const orderByClosestToCenter = (center, buttons) => {
  function buttonDistance(buttonA, buttonB) {
    if (buttonA.distance < buttonB.distance) {
      return -1;
    } else if (buttonA.distance == buttonB.distance) {
      return 0;
    }
    return 1;
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
  return [...buttons].sort((buttonA, buttonB) => {
    if (buttonA.created_at < buttonB.created_at) {
      return 1;
    } else if (buttonA.created_at == buttonB.created_at) {
      return 0;
    }
    return -1;
  });
};

export const orderBy = (buttons, orderBy, center) => {
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


function ExploreContainer(props) {
  const { children } = props

  return (<div className="index__explore-container">
    {children}
  </div>
  )
}

function ExploreContainerLeftColumn(props) {
  const { showLeftColumn, children } = props
  return (
    <div
      className={
        'index__content-left ' +
        (showLeftColumn ? '' : 'index__content-left--hide')
      }
    >{children}</div>)
}

function ExploreContainerList({listButtons, showLeftColumn, showMap, isListOpen, setListOpen, toggleShowMap, toggleShowLeftColumn})
{
  return <List
            buttons={listButtons}
            showLeftColumn={showLeftColumn}
            showMap={showMap}
            isListOpen={isListOpen}
            setListOpen={setListOpen}
            toggleShowMap={toggleShowMap}
            onLeftColumnToggle={toggleShowLeftColumn}
          />
}

function ExploreHexagonMap({toggleShowLeftColumn, exploreSettings, selectedNetwork})
{
  const exploreMapState: ExploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false,
  );
  const boundsFilteredButtons = exploreMapState.boundsFilteredButtons
  const { handleBoundsChange, h3TypeDensityHexes } = useHexagonMap({
    toggleShowLeftColumn,
    exploreSettings,
    filters: exploreMapState.filters,
    boundsFilteredButtons: boundsFilteredButtons,
    cachedHexagons: exploreMapState.cachedHexagons,
    buttonTypes: selectedNetwork?.buttonTemplates,
  });
  const [countFilteredButtons, setCountFilteredButtons] = useState(0)

  useEffect(() => {
    const allHiddenButtons = boundsFilteredButtons.filter((elem) => elem.hideAddress === true)
    
    if(exploreSettings.zoom >= showMarkersZoom ){
      setCountFilteredButtons(allHiddenButtons.length)
    }else{
      setCountFilteredButtons(0)
    }
    
  }, [boundsFilteredButtons, exploreSettings.zoom])

  const [startLongPress, setStartLongPress] = useState(false);
  const [showLongPressMenu, setShowLongPressMenu] = useState(false)
  useEffect(() => {
    let timerId;
    if (startLongPress) {
      setShowLongPressMenu(() => false)
      timerId = setTimeout(() => { setShowLongPressMenu(() => true) }, 300);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress]);

  const events = {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false)
  }

  return ( 
    <div className='index__explore-map-wrapper' {...events}>
      {showLongPressMenu && 
      
        <div className='index__explore-map-menu-overflow'>
          <div className="card-button__dropdown-container">
          <div className="card-button__dropdown-arrow"></div>
            <div className="card-button__dropdown-content" id="listid">
            <CardSubmenuOption
                onClick={() => {
                  router.push(`/ButtonNew`);
                }}
                label={t('explore.create')}
              />
            </div>
        </div>
        
        </div>}

    <HexagonExploreMap
        exploreSettings={exploreSettings}
        h3TypeDensityHexes={h3TypeDensityHexes}
        handleBoundsChange={handleBoundsChange}
        selectedNetwork={selectedNetwork}
        countFilteredButtons={countFilteredButtons}
      /></div>)
}