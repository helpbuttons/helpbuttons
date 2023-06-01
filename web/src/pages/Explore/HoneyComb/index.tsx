//EXPLORE MAP
import React, { useState, useEffect } from 'react';

//components
import { FindButtons } from 'state/Explore';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { withRouter } from 'next/router';
import List from 'components/list/List';
import { buttonTypes } from 'shared/buttonTypes';
import { Button } from 'shared/entities/button.entity';
import { Bounds, Point } from 'pigeon-maps';
import { LoadabledComponent } from 'components/loading';
import {
  LocalStorageVars,
  localStorageService,
} from 'services/LocalStorage';
import HexagonExploreMap from 'components/map/Map/HexagonExploreMap';
import { cellToLatLng } from 'h3-js';
import {
  calculateDensityMap, getResolution,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import {
  BrowseType,
  HbMapTiles,
} from 'components/map/Map/Map.consts';
import { useDebounce, useToggle } from 'shared/custom.hooks';
import { h3SetToFeature } from 'geojson2h3';
import AdvancedFilters from 'components/search/AdvancedFilters';
import {
  ButtonFilters,
  defaultFilters,
} from 'components/search/AdvancedFilters/filters.type';

const defaultZoomPlace = 13;

function HoneyComb({ router }) {
  const currentButton = useRef(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );

  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  const [exploreSettings, setExploreSettings] = useState(() => {
    return {
      center: [0, 0],
      zoom: 4,
      tileType: HbMapTiles.OSM,
      // radius: 10000,
      bounds: null,
      browseType: BrowseType.PINS,
      honeyCombFeatures: null,
      prevZoom: 0,
      loading: true,
    };
  });

  const [hexagonClicked, setHexagonClicked] = useState();
  const debouncedHexagonClicked = useDebounce(hexagonClicked, 70);

  const [hexagonsToFetch, setHexagonsToFetch] = useState({
    resolution: 1,
    hexagons: [],
  });
  const debounceHexagonsToFetch = useDebounce(hexagonsToFetch, 100);
  const [fetchedButtons, setFetchedButtons] = useState(null);
  const [isFetchingHexagons, setIsFetchingHexagons] = useState(false);
  const [filteredButtons, setFilteredButtons] = useState([]);
  const [listButtons, setListButtons] = useState([]);
  const [filters, setFilters] =
    useState<ButtonFilters>(defaultFilters);
  const [queryCenter, setQueryCenter] = useState<Point>(null);
  const [showLeftColumn, toggleShowLeftColumn] = useToggle(true);

  const [h3TypeDensityHexes, seth3TypeDensityHexes] = useState([]);
  const [cachedH3Hexes, setCacheH3Hexes] = useState([]);
  const [nonCachedHexesToFetch, setNonCachedHexesToFetch] = useState(
    [],
  );
  const [showFiltersForm, toggleShowFiltersForm] = useToggle(false);

  useEffect(() => {
    if (debounceHexagonsToFetch.hexagons.length > 0) {
      seth3TypeDensityHexes(() => {
        return debounceHexagonsToFetch.hexagons.map((hexagon) => {
          const cacheHit = cachedH3Hexes.find(
            (cachedHex) => cachedHex.hexagon == hexagon,
          );
          if (cacheHit) {
            return cacheHit;
          }
          const center = cellToLatLng(hexagon);
          return {
            hexagon,
            groupByType: [],
            polygon: h3SetToFeature([hexagon]),
            count: -1,
            center: [center[1], center[0]],
          };
        });
      });

      setNonCachedHexesToFetch(() => {
        return debounceHexagonsToFetch.hexagons.reduce(
          (hexagonsToFetch, hexagon) => {
            const cacheHit = cachedH3Hexes.find(
              (cachedHex) => cachedHex.hexagon == hexagon,
            );
            if (!cacheHit) {
              hexagonsToFetch.push(hexagon);
            }
            return hexagonsToFetch;
          },
          [],
        );
      });
    } else {
      // here should do something...?!
      setIsFetchingHexagons(() => false);
    }
  }, [debounceHexagonsToFetch]);

  useEffect(() => {
    if (nonCachedHexesToFetch.length > 0) {
      store.emit(
        new FindButtons(
          debounceHexagonsToFetch.resolution,
          nonCachedHexesToFetch,
          (buttons) => {
            setFetchedButtons(() => buttons);
          },
          (error) => {
            setFetchedButtons([]);
            console.log('THERE WAS A HARD CORE ERROR');
            console.error(error);
          },
        ),
      );
    }else {
      setIsFetchingHexagons(() => false);
    }
  }, [nonCachedHexesToFetch]);
  const handleBoundsChange = (bounds, center: Point, zoom) => {
    setIsFetchingHexagons(() => true);
    setExploreSettings((previousExploreSettings) => {
      return {
        ...previousExploreSettings,
        prevZoom: previousExploreSettings.zoom,
        zoom: zoom,
        bounds: bounds,
        center: center,
      };
    });
  };

  const setMapCenter = (latLng) => {
    setExploreSettings((prevSettings) => {
      return { ...prevSettings, center: latLng };
    });
  };

  const setMapZoom = (zoom) => {
    setExploreSettings((prevSettings) => {
      return { ...prevSettings, zoom };
    });
  };

  useEffect(() => {
    const exploreSettings = localStorageService.read(
      LocalStorageVars.EXPLORE_SETTINGS,
    );

    if (selectedNetwork) {
      setExploreSettings((prevSettings) => {
        if (queryCenter) {
          return {
            ...prevSettings,
            ...selectedNetwork.exploreSettings,
            loading: false,
            center: queryCenter,
            zoom: defaultZoomPlace,
          };
        }
        return {
          ...prevSettings,
          ...selectedNetwork.exploreSettings,
          loading: false,
        };
      });
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (router && router.query) {
      if (router.query.lat) {
        const lat = parseFloat(router.query.lat);
        const lng = parseFloat(router.query.lng);
        setQueryCenter(() => [lat, lng]);
      }
      if (router.query.showFilters) {
        toggleShowFiltersForm(true);
      }
    }
  }, [router]);

  useEffect(() => {
    console.log('filtering YEaH...')
    if (fetchedButtons) {
      setFilteredButtons(() => {
        console.log('filtering again...')
        console.log(filters)

        let helpButtonsFiltered = fetchedButtons;
        console.log(fetchedButtons.length)
        helpButtonsFiltered = fetchedButtons.filter(
          (button: Button) => {
            if (filters.helpButtonTypes.length > 0) {
              return (
                filters.helpButtonTypes.indexOf(button.type) > -1
              );
            }
            if(filters.query && filters.query.length > 0)
            {
              return (
                (button.title.indexOf(filters.query) > -1 || button.description.indexOf(filters.query) > -1)
              )
            }
            return true;
          },
        );

        console.log(helpButtonsFiltered.length)
        return helpButtonsFiltered
      });
    }
    
    // TODO HERE SHOULD LOAD AS SOON AS THE USER SCROLLS!
  }, [fetchedButtons, filters]);

  useEffect(() => {
    if (debouncedHexagonClicked) {
      toggleShowLeftColumn(true);
      setListButtons(() => {
        if (
          debouncedHexagonClicked.properties.buttons &&
          debouncedHexagonClicked.properties.buttons.length > 0
        ) {
          return debouncedHexagonClicked.properties.buttons;
        }
        return [];
      });
    }else{
      setListButtons(() => filteredButtons)
    }
  }, [debouncedHexagonClicked]);

  useEffect(() => {
    const newHexagons = calculateDensityMap(
      filteredButtons,
      getResolution(exploreSettings.zoom),
    );
    const reducer = (allHexagons, h3hexagon) => {
      if (Array.isArray(h3hexagon)) {
        return h3hexagon.reduce(reducer, allHexagons);
      } else {
        const { hexagon, ...rest } = h3hexagon;
        const exists = allHexagons.find(
          (itrh3hexagon) => itrh3hexagon.hexagon === hexagon,
        );
        if (!exists) {
          allHexagons.push({
            ...rest,
            hexagon: h3hexagon.hexagon,
          });
        } else {
          if (exists.count < 0) {
            allHexagons = allHexagons.filter(
              (itrh3Hexagon) => itrh3Hexagon == hexagon,
            );
            allHexagons.push(exists);
          }
        }

        return allHexagons;
      }
    };

    setCacheH3Hexes((previousCachedH3Hexes) => {
      const nonCached = nonCachedHexesToFetch.reduce(
        (allHexagons, hexagon) => {
          allHexagons.push({
            hexagon,
            groupByType: [],
            polygon: h3SetToFeature([hexagon]),
            count: 0,
            center: cellToLatLng(hexagon),
          });
          return allHexagons;
        },
        previousCachedH3Hexes,
      );

      return newHexagons.reduce((allHexes, hex) => {
        allHexes = allHexes.filter(
          (nonCachedHex) => nonCachedHex.hexagon !== hex.hexagon,
        );
        allHexes.push(hex);
        return allHexes;
      }, nonCached);
    });

    seth3TypeDensityHexes((prevH3TypeDensityHexes) => {
      const nonCached = nonCachedHexesToFetch.reduce(
        (allHexagons, hexagon) => {
          allHexagons.push({
            hexagon,
            groupByType: [],
            polygon: h3SetToFeature([hexagon]),
            count: 0,
            center: cellToLatLng(hexagon),
          });
          return allHexagons;
        },
        [],
      );
      const boundsHexagons = newHexagons.reduce((allHexes, hex) => {
        allHexes = allHexes.filter(
          (nonCachedHex) => nonCachedHex.hexagon !== hex.hexagon,
        );
        allHexes.push(hex);
        return allHexes;
      }, prevH3TypeDensityHexes);

      return boundsHexagons.map((hexagon) => {
        if (hexagon.count > -1) {
          return hexagon;
        } else {
          return { ...hexagon, count: 0 };
        }
      });
    });
    setListButtons(() => filteredButtons);
  }, [filteredButtons]);

  useEffect(() => {
    setResults((prevResults) => {
      return { count: listButtons.length };
    });
    setIsFetchingHexagons(() => false);
  }, [listButtons]);

  const [results, setResults] = useState({ count: 100 });
  const handleSelectedPlace = (place) => {
    setMapCenter([place.geometry.lat, place.geometry.lng]);
    setMapZoom(defaultZoomPlace);
  };

  return (
    <>
      <>
        <div className="index__container">
          {!showFiltersForm ? (
            <>
              <div
                className={
                  'index__content-left ' +
                  (showLeftColumn ? '' : 'index__content-left--hide')
                }
              >
                <NavHeader
                  showFiltersForm={showFiltersForm}
                  toggleShowFiltersForm={toggleShowFiltersForm}
                  filters={{ ...filters, results }}
                  exploreSettings={exploreSettings}
                />
                <List
                  buttons={listButtons}
                  showLeftColumn={showLeftColumn}
                  onLeftColumnToggle={toggleShowLeftColumn}
                />
              </div>
              <LoadabledComponent loading={exploreSettings.loading}>
                <HexagonExploreMap
                  exploreSettings={exploreSettings}
                  h3TypeDensityHexes={h3TypeDensityHexes}
                  currentButton={currentButton}
                  handleBoundsChange={handleBoundsChange}
                  setMapCenter={setMapCenter}
                  setHexagonsToFetch={setHexagonsToFetch}
                  setHexagonClicked={setHexagonClicked}
                  hexagonClicked={hexagonClicked}
                  isFetchingHexagons={isFetchingHexagons}
                />
              </LoadabledComponent>
            </>
          ) : (
            <AdvancedFilters
              toggleShowFiltersForm={toggleShowFiltersForm}
              mapZoom={exploreSettings.zoom}
              mapBounds={exploreSettings.bounds}
              setFilters={(filters) => { setFilters(() => {console.log(filters); return {...defaultFilters,...filters}})}}
              filters={filters}
            />
          )}
        </div>
      </>
    </>
  );
}

export default withRouter(HoneyComb);
